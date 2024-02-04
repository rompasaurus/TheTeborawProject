using Microsoft.AspNetCore.Identity;

namespace TeborawAPI.Entities;

public class AppRole : IdentityRole<int>
{
    public ICollection<AppUserRole> UserRoles { get; set; }
}