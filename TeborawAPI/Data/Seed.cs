using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Entities;

namespace TeborawAPI.Data;

public class Seed
{
    public static async Task SeedUsers(UserManager<AppUser> userManager, RoleManager<AppRole> roleManager)
    {
        if (await userManager.Users.AnyAsync())
        {
            return;
        }
        else
        {
            var userData = await File.ReadAllTextAsync("Data/UserSeedData.json");
            //ignores and still adds lowercase property name 
            var options = new JsonSerializerOptions{PropertyNameCaseInsensitive = true};
            var users = JsonSerializer.Deserialize<List<AppUser>>(userData);

            var roles = new List<AppRole>
            {
                new AppRole { Name = "Member" },
                new AppRole { Name = "Admin" },
                new AppRole { Name = "Moderator" }
            };

            foreach (var role in roles)
            {
                await roleManager.CreateAsync(role);
            }
            
            foreach (var user in users)
            {
                user.UserName = user.UserName.ToLower();
                await userManager.CreateAsync(user, "Pa$$w0rd");
                await userManager.AddToRoleAsync(user, "Member");
            }
            

            var admin = new AppUser
            {
                UserName = "admin"
            };

            await userManager.CreateAsync(admin, "Pa$$w0rd");
            await userManager.AddToRolesAsync(admin, new[] { "Admin", "Moderator" });
        }
    }
}