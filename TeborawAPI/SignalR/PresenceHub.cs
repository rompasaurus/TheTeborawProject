using Microsoft.AspNetCore.SignalR;
using TeborawAPI.Extensions;

namespace TeborawAPI.SignalR;


public class PresenceHub : Hub
{
    private readonly PresenceTracker _tracker;

    public PresenceHub(PresenceTracker tracker)
    {
        _tracker = tracker;
    }
    
    public override async Task OnConnectedAsync()
    {
        var isOnline = await _tracker.UserConnected(Context.User.GetUserName(), Context.ConnectionId);
        if(isOnline) await Clients.Others.SendAsync("UserIsOnline", Context.User.GetUserName());
        var currentUsers = await _tracker.GetOnlineUsers();
        await Clients.Caller.SendAsync("GetOnlineUsers", currentUsers);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var isOffline = await _tracker.UserDisconnected(Context.User.GetUserName(), Context.ConnectionId);
        if(isOffline) await Clients.Others.SendAsync("UserIsOffline", Context.User.GetUserName());
        await base.OnDisconnectedAsync(exception);
    }
}