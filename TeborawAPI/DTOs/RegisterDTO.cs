using System.ComponentModel.DataAnnotations;

namespace TeborawAPI.DTOs;

public class RegisterDTO
{
    [Required]
    public string Username { get; set; }
    [Required]
    [StringLength(32, MinimumLength = 4)]
    public string Password { get; set; }
    
    [Required] public string KnownAs { get; set; }
    [Required] public string Gender { get; set; }
    [Required] public DateOnly? DateOfBirth { get; set; } // optional to make required work
    [Required] public string City { get; set; }
    [Required] public string Country { get; set; }
}