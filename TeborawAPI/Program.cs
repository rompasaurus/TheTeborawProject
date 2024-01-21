using TeborawAPI.Extensions;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddApplicationsServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);


var app = builder.Build();


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




app.Run();

