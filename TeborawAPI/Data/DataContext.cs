using Microsoft.EntityFrameworkCore;
using TeborawAPI.Entities;

namespace TeborawAPI.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<AppUser> Users { get; set; }
}
