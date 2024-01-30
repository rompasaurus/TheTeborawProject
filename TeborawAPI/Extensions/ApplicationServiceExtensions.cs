using TeborawAPI.Data;
using TeborawAPI.Entities;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;
using TeborawAPI.Services;

namespace TeborawAPI.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationsServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddDbContext<DataContext>(opts =>
        {
            opts.UseNpgsql(config.GetConnectionString("DefaultConnection"));
        });
        services.AddControllers();
        services.AddCors();
        services.AddScoped<IUserRepository, UserRepository>();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        services.Configure <CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.AddScoped<IPhotoService, PhotoService>();
        
        return services;
    }
}