using AutoMapper.Execution;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Helpers;

namespace TeborawAPI.Interfaces;

public interface IUserRepository
{
    void Update(AppUser user);
    //Task<bool> SaveALlAsync();
    Task<IEnumerable<AppUser>> GetUsersAsync();
    Task<AppUser> GetUserByIdAsync(int id);
    Task<AppUser> GetUserByUsernameAsync(string username);
    Task<PagedList<MemberDTO>> GetMembersAsync(UserParams userParams);
    Task<MemberDTO> GetMemberAsync(string username);

    Task<string> GetUserGender(string username);

}