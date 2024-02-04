using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using TeborawAPI.Entities;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Services;

public class TokenService: ITokenService
{
    private readonly UserManager<AppUser> _userManager;
    private readonly SymmetricSecurityKey _key;
    
    public TokenService(IConfiguration config, UserManager<AppUser> userManager)
    {
        _userManager = userManager;
        _key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(config["TokenKey"]));
    }
    public async Task<string> CreateToken(AppUser user)
    {
        // Add the users claimset, need to atleast have a username or id identifier further claims will be added later once funcitionailty requiring it is established
        var claims = new List<Claim>()
        {
            new Claim(JwtRegisteredClaimNames.NameId, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.UniqueName, user.UserName),
        };

        var roles = await _userManager.GetRolesAsync(user);
        
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role,role)));
        
        
        //Establish the highest sha 512 ecryption key generation for token signature 
        var credentials = new SigningCredentials(_key, SecurityAlgorithms.HmacSha512Signature);
        //Set expiry and issuance dates along with claims
        var tokenDescriptor = new SecurityTokenDescriptor()
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.Now.AddDays(7),
            SigningCredentials = credentials
        };

        var tokenHandler = new JwtSecurityTokenHandler();
        var token = tokenHandler.CreateToken(tokenDescriptor);
        //using System.IdentityModel.Tokens.Jwt; takes provided token details and establishes a properly formatted jwt token 
        return tokenHandler.WriteToken(token);
    }
}