using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Data;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Middleware;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationsServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
app.UseMiddleware<ExceptionMiddleware>();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseRouting();
app.UseCors(cPolicyBuilder => cPolicyBuilder.AllowAnyHeader()
    .AllowAnyMethod().WithOrigins("https://localhost:4200"));

//The location of these need to be after cors establishment but prior to route and controller mapping 
// Are you who you say you are 
app.UseAuthentication();
// What are you allowed to do
app.UseAuthorization();

app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    //with a freshly dropped db this will rerun all the migration scripts create the db and then run seed
    await context.Database.MigrateAsync();
    await Seed.SeedUsers(userManager);
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger?.LogError(ex, "An error occured during migration");
}

app.Run();

