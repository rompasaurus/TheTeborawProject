using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Data;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Controllers;

public class AccountController: BaseAPIController
{
    private readonly UserManager<AppUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountController(UserManager<AppUser> userManager, ITokenService tokenService, IMapper mapper)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    [HttpPost("register")] // api/account/register
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
    {
        if (await UserExists(registerDTO.Username)) return BadRequest("Username already exists");

        using var hmac = new HMACSHA512();
        
        var user = _mapper.Map<AppUser>(registerDTO);

        var result = await _userManager.CreateAsync(user, registerDTO.Password);
        if (!result.Succeeded) return BadRequest(result.Errors);

        var roleResults = await _userManager.AddToRoleAsync(user, "Member");
        
        if(!roleResults.Succeeded) return BadRequest(result.Errors);
        
        return new UserDTO()
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
    {
        var user = await _userManager.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserName.ToLower() == loginDTO.Username.ToLower());
        
        if (user == null) return Unauthorized("Invalid Username");

        var result = await _userManager.CheckPasswordAsync(user, loginDTO.Password);
        
        if(!result) return Unauthorized("Invalid Password");
        
        return new UserDTO()
        {
            Username = user.UserName,
            Token = await _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };

    }

    private async Task<bool> UserExists(string userName)
    {
        return await _userManager.Users.AnyAsync(x => x.UserName == userName);
    }
}