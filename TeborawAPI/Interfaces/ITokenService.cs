using TeborawAPI.Entities;

namespace TeborawAPI.Interfaces;

public interface ITokenService
{
    Task<string> CreateToken(AppUser user);
}