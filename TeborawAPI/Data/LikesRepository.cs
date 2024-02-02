using Microsoft.EntityFrameworkCore;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Data;

public class LikesRepository : ILikesRepository
{
    private readonly DataContext _context;

    public LikesRepository(DataContext context)
    {
        _context = context;
    }
    public async Task<UserLike> GetUserLike(int sourceUserId, int targetUserId)
    {
        return await _context.Likes.FindAsync(sourceUserId, targetUserId);
    }

    public async Task<AppUser> GerUserWithLikes(int userID)
    {
        return await _context.Users
            .Include(x => x.LikedUsers)
            .FirstOrDefaultAsync(x => x.Id == userID);
    }

    public async Task<IEnumerable<LikeDTO>> GetUserLikes(string predicate, int userId)
    {
        //remmember querables dont get executed
        var users = _context.Users.OrderBy(u => u.UserName).AsQueryable();
        var likes = _context.Likes.AsQueryable();

        if (predicate == "liked")
        {
            likes = likes.Where(like => like.SourceUserId == userId);
            users = likes.Select(like => like.TargetUser);
        }
        
        if (predicate == "likedBy")
        {
            likes = likes.Where(like => like.TargetUserId == userId);
            users = likes.Select(like => like.SourceUser);
        }

        return await users.Select(user => new LikeDTO
        {
            UserName = user.UserName,
            KnownAs = user.KnownAs,
            Age = user.DateOfBirth.CalculateAge(),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain).Url,
            City = user.City,
            Id = user.Id
        }).ToListAsync();

    }
    
}