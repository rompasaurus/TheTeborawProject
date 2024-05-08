namespace TeborawAPI.Models;
public class JournalRaw
{


    public JournalRaw(int journalRawId, string content, DateTime dateCreated, DateTime lastUpdates, string userId)
    {
        JournalRawId = journalRawId;
        Content = content;
        DateCreated = dateCreated;
        LastUpdated = lastUpdates;
        UserId = userId;
    }

    public JournalRaw()
    {
        Title = "New Journal";
        Content = "Type Your Title Here";
        DateCreated = DateTime.Today;
        LastUpdated = DateTime.Today;
        UserId = "";
        UserName = "";
    }

    public int JournalRawId { get; set; }
    public string Content { get; set; }
    
    public string? Title { get; set; }

    private DateTime _dateCreated;
    public DateTime DateCreated
    {
        get => _dateCreated;
        set => _dateCreated = value.ToUniversalTime();
    }

    private DateTime _lastUpdated;
    public DateTime LastUpdated
    {
        get => _lastUpdated;
        set => _lastUpdated = value.ToUniversalTime();
    }
    public string UserId { get; set; }
    public string UserName { get; set; }
    public string? TopicTree { get; set; } //json data
    
}