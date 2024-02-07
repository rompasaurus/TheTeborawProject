namespace TeborawAPI.Entities;

public class Connection
{
    //empty constructo need so that a init Connection can be created without params
    public Connection()
    {
        
    }
    public Connection(string connectionId, string username)
    {
        ConnectionId = connectionId;
        Username = username;
    }

    public string ConnectionId { get; set; }
    public string Username { get; set; }
    
}