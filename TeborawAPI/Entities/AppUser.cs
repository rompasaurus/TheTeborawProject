﻿using System.ComponentModel.DataAnnotations;
using TeborawAPI.Extensions;

namespace TeborawAPI.Entities;

public class AppUser
{
    public int Id { get; set; }
    
    [Required]
    public string UserName {get; set;}
    public Byte[] PasswordHash { get; set; }
    public Byte[] PasswordSalt { get; set; }
    public DateOnly DateOfBirth { get; set; }
    public string KnownAs { get; set; }
    public DateTime Created { get; set; } = DateTime.UtcNow;
    public DateTime LastActive { get; set; } = DateTime.UtcNow;
    public string Gender { get; set; }
    public string? Introduction { get; set; }
    public string Country { get; set; }
    public string City { get; set; }
    public string? Interests { get; set; } 
    public string? LookingFor { get; set; }
    public List<Photo> Photos { get; set; } = new();

    public List<UserLike> LikeByUsers { get; set; }
    public List<UserLike> LikedUsers { get; set; }

    public List<Messages> MessagesSent { get; set; }
    public List<Messages> MessagesRecieved { get; set; }
    
}