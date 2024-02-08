using AutoMapper;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Data;

public class MessageRepository : IMessageRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public MessageRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public void AddMessage(Message message)
    {
        _context.Messages.Add(message);
    }

    public void DeleteMessage(Message message)
    {
        _context.Messages.Remove(message);
    }

    public async Task<Message> GetMessage(int id)
    {
        return await _context.Messages.FindAsync(id);
    }

    public async Task<PagedList<MessageDTO>> GetMessagesForUser(MessageParams messageParams)
    {
        var query = _context.Messages
            .OrderByDescending(x => x.MessageSent)
            .AsQueryable();

        query = messageParams.Container switch
        {
            "Inbox" => query.Where(u => u.RecipientUsername == messageParams.Username && u.RecipientDeleted == false),
            "Outbox" => query.Where(u => u.SenderUsername == messageParams.Username && u.RecipientDeleted == false),
            _ => query.Where(u => u.RecipientUsername == messageParams.Username && u.DateRead == null && u.RecipientDeleted == false)
        };

        var messages = query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider);

        return await PagedList<MessageDTO>
            .CreateAsync(messages, messageParams.PageNumber, messageParams.PageSize);
    }
    
    //pull the messages and mark the one where the recipient username is the current logged in user as read by updateing the date read
    public async Task<IEnumerable<MessageDTO>> GetMessageThread(string currentUsername, string recipientUsername)
    {
        var query = _context.Messages
            .Where(
                m => m.RecipientUsername == currentUsername && m.RecipientDeleted == false &&
                     m.SenderUsername == recipientUsername ||
                     m.RecipientUsername == recipientUsername && m.SenderDeleted == false &&
                     m.SenderUsername == currentUsername
            ).OrderBy(m => m.MessageSent)
            .AsQueryable();

        var unreadMessages = query.Where(m => m.DateRead == null 
                                                 && m.RecipientUsername == currentUsername).ToList();
        if(unreadMessages.Any())
        {
            foreach (var msg in unreadMessages)
            {
                msg.DateRead = DateTime.UtcNow;
            }
        }

        return await query.ProjectTo<MessageDTO>(_mapper.ConfigurationProvider).ToListAsync();
    }

    // public async Task<bool> SaveAllAsync()
    // {
    //     return await _context.SaveChangesAsync() > 0;
    // }

    public void AddGroup(Group group)
    {
        _context.Groups.Add(group);
    }

    public void RemoveConnection(Connection connection)
    {
        _context.Remove(connection);
    }

    public async Task<Connection> GetConnection(string connectionId)
    {
        return await _context.Connections.FindAsync(connectionId);
    }

    public async Task<Group> GetMessageGroup(string groupName)
    {
        return await _context.Groups
            .Include(x => x.Connections)
            .FirstOrDefaultAsync(x => x.name == groupName);
    }

    public async Task<Group> GetGroupForConnection(string connectionId)
    {
        return await _context.Groups
            .Include(x => x.Connections)
            .Where(x => x.Connections.Any(c => c.ConnectionId == connectionId))
            .FirstOrDefaultAsync();
    }
}