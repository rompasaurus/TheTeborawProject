using TeborawAPI.Entities;

namespace TeborawAPI.Interfaces;

public interface ITokenService
{
    string CreateToken(AppUser user);
}