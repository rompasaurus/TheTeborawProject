using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Interfaces;

namespace TeborawAPI.SignalR;

[Authorize]
public class MessageHub : Hub
{
    private readonly IMessageRepository _messageRepository;
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public MessageHub(IMessageRepository messageRepository, IUserRepository userRepository, IMapper mapper)
    {
        _messageRepository = messageRepository;
        _userRepository = userRepository;
        _mapper = mapper;
    }

    
    //  establishes a group relationship between 2 users 
    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var otherUser = httpContext.Request.Query["user"];
        var groupName = GetGroupName(Context.User.GetUserName(), otherUser);
        await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        
        var messages = await _messageRepository.GetMessageThread(Context.User.GetUserName(), otherUser);

        await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
        
    }

    public override Task OnDisconnectedAsync(Exception? exception)
    {
        return base.OnDisconnectedAsync(exception);
    }

    public async Task SendMessage(CreateMessageDTO createMessageDto)
    {
        var username = Context.User.GetUserName();
        if (username == createMessageDto.RecipientUsername.ToLower())
        {
            throw new HubException("YOu cannot send messages to yourself bitch");
        }

        var sender = await _userRepository.GetUserByUsernameAsync(username);
        var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername);
        
        if(recipient == null) throw new HubException("Not found user");

        var message = new Message
        {
            Sender = sender,
            Recipient = recipient,
            SenderUsername = sender.UserName,
            RecipientUsername = recipient.UserName,
            Content = createMessageDto.Content
        };
        
        _messageRepository.AddMessage(message);

        if (await _messageRepository.SaveAllAsync())
        {
            var group = GetGroupName(sender.UserName, recipient.UserName);
            await Clients.Group(group).SendAsync("NewMessage", _mapper.Map < MessageDTO(message));
        }
    }

    private string GetGroupName(string caller, string other)
    {
        //Compare ordinal returns a value comparison between two strings basically allow to put the string in alphabetical order and return a group name
        var stringCompare = string.CompareOrdinal(caller, other) < 0;
        return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
    }
        
}