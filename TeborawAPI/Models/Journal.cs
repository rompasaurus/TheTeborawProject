namespace TeborawAPI.Models;

public class Journal
{
    public int JournalID { get; set; }
    public string Title { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime LastUpdates { get; set; }
    public int? UserID { get; set; }
}