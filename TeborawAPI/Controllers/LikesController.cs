using Microsoft.AspNetCore.Mvc;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Controllers;

public class LikesController : BaseAPIController
{
    private readonly IUnitOfWork _unitOfWork;

    public LikesController(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    
    //the logged in/ source user is applying a like to liked user 
    [HttpPost("{username}")]
    public async Task<ActionResult> AddLike(string username)
    {
        
        var sourceUserId =User.GetUserId();
        var likedTargetUser = await _unitOfWork.UserRepository.GetUserByUsernameAsync(username);
        var sourceUser = await _unitOfWork.LikesRepository.GerUserWithLikes(sourceUserId);
        
        if(likedTargetUser == null) return NotFound();
        if(sourceUser.UserName == username) return BadRequest("You Cannot Like yourself");

        //check the liked user db and ensure like from source user has not been applied to target user
        var userLike = await _unitOfWork.LikesRepository.GetUserLike(sourceUserId, likedTargetUser.Id);
        if(userLike != null) return BadRequest("You Already Like this user");

        userLike = new UserLike
        {
            SourceUserId = sourceUserId,
            TargetUserId = likedTargetUser.Id
        };

        sourceUser.LikedUsers.Add(userLike);

        if (await _unitOfWork.Complete()) return Ok();

        return BadRequest("Failed to like user ");

    }

    [HttpGet]
    public async Task<ActionResult<PagedList<LikeDTO>>> GetUserLikes([FromQuery] LikesParams likesParams)
    {
        likesParams.UserId = User.GetUserId();
        var users = await _unitOfWork.LikesRepository.GetUserLikes(likesParams);
        
        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, 
            users.PageSize, users.TotalCount, users.TotalPages));

        return Ok(users);
    }
}