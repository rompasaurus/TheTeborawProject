using CloudinaryDotNet;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Data;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Helpers;
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
builder.Configuration.AddEnvironmentVariables();

var connString = "";
if (builder.Environment.IsDevelopment())
{
    connString = builder.Configuration.GetConnectionString("DefaultConnection");
    builder.Services.Configure<CloudinarySettings>(builder.Configuration.GetSection("CloudinarySettings"));
}
else
{
    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");
    connString = connUrl;
    builder.Services.Configure<CloudinarySettings>(options =>
    {
        options.ApiKey = Environment.GetEnvironmentVariable("APIKEY");
        options.ApiSecret = Environment.GetEnvironmentVariable("APISECRET");
        options.CloudName = Environment.GetEnvironmentVariable("CLOUDNAME");
    });

}
builder.Services.AddDbContext<DataContext>(opt =>
{
    opt.UseNpgsql(connString);
});
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
//This allow the angular build static files to be hosted along with the api within kestral
app.UseDefaultFiles();
app.UseStaticFiles();


app.MapControllerRoute(
    name: "default",
    pattern: "{controller}/{action=Index}/{id?}");

app.MapHub<PresenceHub>("hubs/presence");
app.MapHub<MessageHub>("hubs/message");
app.MapFallbackToController("Index", "Fallback");

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
    await context.Database.ExecuteSqlRawAsync("TRUNCATE TABLE \"Connections\"");
}
catch (Exception ex)
{
    var logger = services.GetService<ILogger<Program>>();
    logger?.LogError(ex, "An error occured during migration");
}

app.Run();

