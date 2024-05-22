using Microsoft.EntityFrameworkCore;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;
using TeborawAPI.Models;

namespace TeborawAPI.Data;

public class JournalRepository : IJournalRepository
{
    private readonly DataContext _context;

    public JournalRepository(DataContext context)
    {
        _context = context;
    }

    public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await _context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public async Task<JournalRaw> getLatestJournalRaw(string userId)
    {
        var journalRaw = _context.JournalRaw
            .Where(j => j.UserId == userId)
            .OrderByDescending(j => j.LastUpdated)
            .FirstOrDefault() ?? new JournalRaw();;
        return journalRaw;
    }
    
    public async Task<List<JournalRaw>> getUserJournalListRaw(string userId)
    {
        var journalListRaw = _context.JournalRaw
            .Where(j => j.UserId == userId)
            .OrderBy(j => j.LastUpdated)
            .ToList();
        return journalListRaw;
    }
    
    
    public async Task<AppUser> GerUserWithLikes(int userID)
    {
        return await _context.Users
            .Include(x => x.LikedUsers)
            .FirstOrDefaultAsync(x => x.Id == userID);
    }

    public async Task<PagedList<LikeDTO>> GetUserLikes(LikesParams likesParams)
    {
        //remmember querables dont get executed
        var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();

        if (likesParams.predicate == "liked")
        {
            likes = likes.Where(like => like.SourceUserId == likesParams.UserId);
            users = likes.Select(like => like.TargetUser);
        }
        
        if (likesParams.predicate  == "likedBy")
        {
            likes = likes.Where(like => like.TargetUserId == likesParams.UserId);
            users = likes.Select(like => like.SourceUser);
        }

        var likedUsers = users.Select(user => new LikeDTO
        {
            UserName = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
            City = user.City,
            Id = user.Id
        });

        return await PagedList<LikeDTO>.CreateAsync(likedUsers, likesParams.PageNumber, likesParams.PageSize);
    }

}