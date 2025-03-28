using TeborawAPI.Data;
using TeborawAPI.Entities;
using Microsoft.AspNetCore.Cors.Infrastructure;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;
using TeborawAPI.Services;
using TeborawAPI.SignalR;

namespace TeborawAPI.Extensions;

public static class ApplicationServiceExtensions
{
    public static IServiceCollection AddApplicationsServices(this IServiceCollection services, IConfiguration config)
    {
        services.AddScoped<ITokenService, TokenService>();
        services.AddEndpointsApiExplorer();
        services.AddSwaggerGen();
        services.AddControllers();
        services.AddCors();
        services.AddAutoMapper(AppDomain.CurrentDomain.GetAssemblies());
        //services.Configure <CloudinarySettings>(config.GetSection("CloudinarySettings"));
        services.AddScoped<IPhotoService, PhotoService>();
        services.AddScoped<LogUserActivity>();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        // services.AddScoped<IUserRepository, UserRepository>();
        // services.AddScoped<ILikesRepository, LikesRepository>();
        // services.AddScoped<IMessageRepository, MessageRepository>();
        services.AddSignalR();
        services.AddSingleton<PresenceTracker>();
        
        
        return services;
    }
}