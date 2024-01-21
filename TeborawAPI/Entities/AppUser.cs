using System.ComponentModel.DataAnnotations;

namespace TeborawAPI.Entities;

public class AppUser
{
    public int Id { get; set; }
    
    [Required]
    public string UserName {get; set;}
    public Byte[] PasswordHash { get; set; }
    public Byte[] PasswordSalt { get; set; }
    

}
