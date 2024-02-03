using Microsoft.EntityFrameworkCore;
using TeborawAPI.Entities;

namespace TeborawAPI.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions options) : base(options)
    {
    }
    public DbSet<AppUser> Users { get; set; }
    public DbSet<UserLike> Likes { get; set; }
    
    public DbSet<Message> Messages { get; set; }

    //this manually create the many to manny relations with the userlike table and estblish the delete cascade mechanism
    //its possible ef can handle this by default but you have more control this way
    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
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
