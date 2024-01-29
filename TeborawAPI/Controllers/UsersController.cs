using System.Security.Claims;
using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Data;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Controllers;
[Authorize]
public class UsersController : BaseAPIController
{
    private readonly IUserRepository _userRepository;
    private readonly IMapper _mapper;

    public UsersController(IUserRepository userRepository, IMapper mapper)
    {
        _userRepository = userRepository;
        _mapper = mapper;
    }
    
    [HttpGet]
    public async Task<ActionResult<IEnumerable<MemberDTO>>> GetUsers()
    {
        var users = await _userRepository.GetMembersAsync();
        return Ok(users);
        
    }
    
    [HttpGet("{username}")] // /api/users/2
    //gonna get  weird result if username not foune
    public async Task<ActionResult<MemberDTO>> GetUser(string username)
    {
        return await _userRepository.GetMemberAsync(username);
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
        var username = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var user = await _userRepository.GetUserByUsernameAsync(username);
        
        if(user == null) return NotFound();

        _mapper.Map(memberUpdateDto, user);

        if (await _userRepository.SaveALlAsync()) return NoContent();

        return BadRequest("Failed to Update User");
    }
}