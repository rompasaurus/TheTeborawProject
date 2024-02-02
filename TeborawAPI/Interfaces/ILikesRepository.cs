using TeborawAPI.DTOs;
using TeborawAPI.Entities;

namespace TeborawAPI.Interfaces;

public interface ILikesRepository
{
    Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
    Task<AppUser> GerUserWithLikes(int userID);
    Task<IEnumerable<LikeDTO>> GetUserLikes(string predicate, int userId);
}