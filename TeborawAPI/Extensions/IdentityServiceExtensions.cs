using System.Text;
using Microsoft.IdentityModel.Tokens;

namespace TeborawAPI.Extensions;
using Microsoft.AspNetCore.Authentication.JwtBearer;

public static class IdentityServiceExtensions
{
    public static IServiceCollection AddIdentityServices(this IServiceCollection services, IConfiguration config)
    {
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
        return services;
    }
}