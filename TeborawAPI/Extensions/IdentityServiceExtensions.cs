using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using TeborawAPI.Data;
using TeborawAPI.Entities;

namespace TeborawAPI.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddIdentityCore<AppUser>(opt =>
            {
                opt.Password.RequireNonAlphanumeric = false;
                //opt.User.RequireUniqueEmail;
            })
            .AddRoles<AppRole>()
            .AddRoleManager<RoleManager<AppRole>>()
            .AddEntityFrameworkStores<DataContext>();
        
        // Middleware to tie into the [Authorize] Routes called to validate jwt issuance nonexpiry and user
        services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(opts =>
            {
                opts.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding
                        .UTF8.GetBytes(config["TokenKey"])),
                    ValidateIssuer = false,
                    ValidateAudience = false
                };
            });

        services.AddAuthorization(opts =>
        {
            opts.AddPolicy("RequireAdminRole", policy => policy.RequireRole("Admin"));
            opts.AddPolicy("ModeratePhotoRole", policy => policy.RequireRole("Admin", "Moderator"));
        });
        return services;
    }
}