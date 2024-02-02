using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Helpers;

namespace TeborawAPI.Interfaces;

public interface ILikesRepository
{
    Task<UserLike> GetUserLike(int sourceUserId, int targetUserId);
    Task<AppUser> GerUserWithLikes(int userID);
    Task<PageList<LikeDTO>> GetUserLikes(LikesParams likesParams);
}