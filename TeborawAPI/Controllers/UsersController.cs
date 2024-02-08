using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Data;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Controllers;
[Authorize]
public class UsersController : BaseAPIController
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;
    private readonly IPhotoService _photoService;

    public UsersController(IUnitOfWork unitOfWork, IMapper mapper, IPhotoService photoService)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _photoService = photoService;
    }
    
    
    //[Authorize(Roles = "Admin")]
    [HttpGet]
    //[FromQuery] will dictate the api endpoint call will be in the form of /api/users?pageNumber=1&pageSize=5
    //By default with no query returns pageNumber 1 and pageSize 10
    public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers([FromQuery]UserParams userParams)
    {
        var gender = await _unitOfWork.UserRepository.GetUserGender(User.GetUserName());
        userParams.CurrentUserName = User.GetUserName();

        if (string.IsNullOrEmpty(userParams.Gender))
        {
            userParams.Gender = gender == "male" ? "female" : "male";
        }
        
        var users = await _unitOfWork.UserRepository.GetMembersAsync(userParams);
        
        Response.AddPaginationHeader(new PaginationHeader(users.CurrentPage, users.PageSize,users.TotalCount, users.TotalPages));
        
        return Ok(users);
        
    }
    
    //[Authorize(Roles = "Member")]
    [HttpGet("{username}")] // /api/users/2
    //gonna get  weird result if username not foune
    public async Task<ActionResult<MemberDTO>> GetUser(string username)
    {
        return await _unitOfWork.UserRepository.GetMemberAsync(username);
    }

    [HttpPut]
    public async Task<ActionResult> UpdateUser(MemberUpdateDTO memberUpdateDto)
    {
        //THe username will be accessble via the claims principle of the user obtain via the token passed 
        //in via the headed of this request
        //debug will show this > user >results view > 
        //[0] > ex: {http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier: lisa}
        //nameidentifier: lisa or the value of 0 array memebr will be the user name as establishe in the Token service
        // Via new Claim(JwtRegisteredClaimNames.NameId, user.UserName),
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());
        
        if(user == null) return NotFound();

        _mapper.Map(memberUpdateDto, user);

        if (await _unitOfWork.Complete()) return NoContent();

        return BadRequest("Failed to Update User");
    }

    [HttpPost("add-photo")]
    public async Task<ActionResult<PhotoDTO>> AddPhoto(IFormFile file)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());
        if (user == null) return NotFound();
        var result = await _photoService.AppPhotoAsync(file);
        if(result.Error != null) return BadRequest(result.Error.Message);
        var photo = new Photo
        {
            Url = result.SecureUrl.AbsoluteUri,
            PublicId = result.PublicId
        };

        if (user.Photos.Count == 0) photo.IsMain = true;

        user.Photos.Add(photo);
        //need to return a 201 response instead of 200 with new resource url not this way 
        //if(await _unitOfWork.Complete()) return _mapper.Map<PhotoDTO>(photo);
        //This way below create a action or enpoint utl to the getuser endpoint passing in the username as an object 
        //along with the mapped photo
        if(await _unitOfWork.Complete())
            return CreatedAtAction(nameof(GetUser), 
                new { username = user.UserName }, 
                _mapper.Map<PhotoDTO>(photo));

        return BadRequest("Problem Adding Photo");
    }

    [HttpPut("set-main-photo/{photoId}")]
    public async Task<ActionResult> SetMainPhoto(int photoId)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());
        
        if (user == null) return NotFound();
        
        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        
        if (photo == null) return NotFound();
        
        if (photo.IsMain) return BadRequest("This is already the main photo!");
        
        var currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

        if (currentMain != null) currentMain.IsMain = false;
        photo.IsMain = true;
        
        if(await _unitOfWork.Complete()) return NoContent();

        return BadRequest("There was a problem setting the main photo");
    }

    [HttpDelete("delete-photo/{photoId}")]
    public async Task<ActionResult> DeletePhoto(int photoId)
    {
        var user = await _unitOfWork.UserRepository.GetUserByUsernameAsync(User.GetUserName());

        var photo = user.Photos.FirstOrDefault(x => x.Id == photoId);
        
        if(photo == null) return NotFound();
        
        if(photo.IsMain) return BadRequest("You cannot delete your main photo.");
        
        if(photo.PublicId != null)
        {
            var result = await _photoService.DeletePhotoAsync(photo.PublicId);
            if(result.Error != null) return BadRequest(result.Error.Message);
        }

        user.Photos.Remove(photo);
        
        if(await _unitOfWork.Complete()) return Ok();

        return BadRequest("Problem Deleting Photo");
    }
}