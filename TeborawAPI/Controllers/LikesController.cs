using Microsoft.AspNetCore.Mvc;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Controllers;

public class LikesController : BaseAPIController
{
    private readonly IUserRepository _userRepository;
    private readonly ILikesRepository _likesRepository;

    public LikesController(IUserRepository userRepository, ILikesRepository likesRepository)
    {
        _userRepository = userRepository;
        _likesRepository = likesRepository;
    }

    
    //the logged in/ source user is applying a like to liked user 
    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        
        var sourceUserId = int.Parse(User.GetUserId());
        var likedTargetUser = await _userRepository.GetUserByUsernameAsync(username);
        var sourceUser = await _likesRepository.GerUserWithLikes(sourceUserId);
        
        if(likedTargetUser == null) return NotFound();
        if(sourceUser.UserName == username) return BadRequest("You Cannot Like yourself");

        //check the liked user db and ensure like from source user has not been applied to target user
        var userLike = await _likesRepository.GetUserLike(sourceUserId, likedTargetUser.Id);
        if(userLike != null) return BadRequest("You Already Like this user");

        userLike = new UserLike
        {
            SourceUserId = sourceUserId,
            TargetUserId = likedTargetUser.Id
        };

        sourceUser.LikedUsers.Add(userLike);

        if (await _userRepository.SaveALlAsync()) return Ok();

        return BadRequest("Failed to like user ");

    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<LikeDTO>>> GetUserLikes(string predicate)
    {
        var users = await _likesRepository.GetUserLikes(predicate, int.Parse(User.GetUserId()));

        return Ok(users);
    }
}