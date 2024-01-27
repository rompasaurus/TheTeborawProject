using System.ComponentModel.DataAnnotations.Schema;

namespace TeborawAPI.Entities;

//allows you to override the auto table name of entity framework with your own
//In this case Users will have more than one photo and wan the plural version of
//it ef by default would have set photo as the table

[Table("Photos")]
public class Photo
{
    public int Id { get; set; }
    public string Url { get; set; }
    public bool IsMain { get; set; }
    public string PublicId { get; set; }
    public int AppUserId { get; set; }
    public AppUser AppUser { get; set; }
}