using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Data;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Middleware;
using TeborawAPI.SignalR;

// var builder = WebApplication.CreateBuilder(args);
var builder = WebApplication.CreateBuilder(new WebApplicationOptions
{
    Args = args,
    WebRootPath = "wwwroot/browser"
});
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
app.UseCors(cPolicyBuilder => cPolicyBuilder
    .AllowAnyHeader()
    .AllowCredentials()
    .AllowAnyMethod()
    .WithOrigins("https://localhost:4200"));

//The location of these need to be after cors establishment but prior to route and controller mapping 
// Are you who you say you are 
app.UseAuthentication();
// What are you allowed to do
app.UseAuthorization();


//THe index.html if available will be hosted 
app.UseDefaultFiles();
app.UseStaticFiles();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");


using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;
try
{
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    var roleManager = services.GetRequiredService<RoleManager<AppRole>>();
    //with a freshly dropped db this will rerun all the migration scripts create the db and then run seed
    await context.Database.MigrateAsync();
    //only good for smaall ops
    //context.Connections.RemoveRange(context.Connections);
    await Seed.SeedUsers(userManager, roleManager);
    await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE [Connections]");
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger?.LogError(ex, "An error occured during migration");
}

app.Run();

