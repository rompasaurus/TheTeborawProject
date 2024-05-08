using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Entities;
using TeborawAPI.Models;

namespace TeborawAPI.Data;

public class DataContext : IdentityDbContext<AppUser, AppRole, int, 
    IdentityUserClaim<int>, AppUserRole, IdentityUserLogin<int>, 
    IdentityRoleClaim<int>, IdentityUserToken<int>>
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }
    
    //this is now inherited from the identitydbcontext
    // public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    public DbSet<JournalRaw> JournalRaw { get; set; }
    public DbSet<Journal> Journal { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Group> Groups { get; set;}
    public DbSet<Connection> Connections { get; set;}
    //this manually create the many to manny relations with the userlike table and estblish the delete cascade mechanism
    //its possible ef can handle this by default but you have more control this way
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);

        // configure builder to dictate the AppUser and Approle relationship
        // App user 1 can have many roles 
        // roles 1 can be assigne to many user
        builder.Entity<AppUser>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.User)
            .HasForeignKey(ur => ur.UserId)
            .IsRequired();
        
        builder.Entity<AppRole>()
            .HasMany(ur => ur.UserRoles)
            .WithOne(u => u.Role)
            .HasForeignKey(ur => ur.RoleId)
            .IsRequired();

        builder.Entity<UserLike>()
            .HasKey(k => new { k.SourceUserId, k.TargetUserId });

        builder.Entity<UserLike>()
            .HasOne(s => s.SourceUser)
            .WithMany(l => l.LikedUsers)
            .HasForeignKey(s => s.SourceUserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Entity<UserLike>()
            .HasOne(s => s.TargetUser)
            .WithMany(l => l.LikeByUsers)
            .HasForeignKey(s => s.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        builder.Entity<Message>()
            .HasOne(s => s.Recipient)
            .WithMany(l => l.MessagesRecieved)
            //.HasForeignKey(s => s.RecipientId)
            .OnDelete(DeleteBehavior.Restrict);
        
        builder.Entity<Message>()
            .HasOne(s => s.Sender)
            .WithMany(l => l.MessagesSent)
            //.HasForeignKey(s => s.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

    }
}
