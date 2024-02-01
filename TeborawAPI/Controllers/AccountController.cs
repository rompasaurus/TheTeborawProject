using System.Security.Cryptography;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Data;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Controllers;

public class AccountController: BaseAPIController
{
    private readonly DataContext _context;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;

    public AccountController(DataContext context, ITokenService tokenService, IMapper mapper)
    {
        _context = context;
        _tokenService = tokenService;
        _mapper = mapper;
    }

    [HttpPost("register")] // api/account/register
    public async Task<ActionResult<UserDTO>> Register(RegisterDTO registerDTO)
    {
        if (await UserExists(registerDTO.Username)) return BadRequest("Username already exists");

        using var hmac = new HMACSHA512();
        
        var user = _mapper.Map<AppUser>(registerDTO);
        
        user.UserName = registerDTO.Username.ToLower();
        user.PasswordHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(registerDTO.Password));
        user.PasswordSalt = hmac.Key;

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return new UserDTO()
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };
    }

    [HttpPost("login")]
    public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO)
    {
        var user = await _context.Users.Include(p => p.Photos).FirstOrDefaultAsync(u => u.UserName.ToLower() == loginDTO.Username.ToLower());
        
        if (user == null) return Unauthorized("Invalid Username");
        //validate password by reversing the hash algo 
        using var hmac = new HMACSHA512(user.PasswordSalt);
        //pull the compute hash of user imput pw  
        var computedHash = hmac.ComputeHash(Encoding.UTF8.GetBytes(loginDTO.Password));

        for (int i = 0; i < computedHash.Length; i++)
        {
            if (computedHash[i] != user.PasswordHash[i]) return Unauthorized("Invalid password");
        }
        
        return new UserDTO()
        {
            Username = user.UserName,
            Token = _tokenService.CreateToken(user),
            PhotoUrl = user.Photos.FirstOrDefault(x => x.IsMain)?.Url,
            KnownAs = user.KnownAs,
            Gender = user.Gender
        };

    }
    // private async Task<AppUser> retrieveUser(string loginDtoUsername)
    // {
    //     return await _context.Users.FirstOrDefaultAsync(u => u.UserName == loginDtoUsername);
    // }

    private async Task<bool> UserExists(string userName)
    {
        return await _context.Users.AnyAsync(x => x.UserName == userName);
    }
}