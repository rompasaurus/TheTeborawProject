using AutoMapper;
using AutoMapper.Execution;
using AutoMapper.QueryableExtensions;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.DTOs;
using TeborawAPI.Entities;
using TeborawAPI.Helpers;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Data;

public class UserRepository : IUserRepository
{
    private readonly DataContext _context;
    private readonly IMapper _mapper;

    public UserRepository(DataContext context, IMapper mapper)
    {
        _context = context;
        _mapper = mapper;
    }
    public void Update(AppUser user)
    {
        _context.Entry(user).State = EntityState.Modified;
    }

    public async Task<bool> SaveALlAsync()
    {
        return await _context.SaveChangesAsync() > 0;
    }

    public async Task<IEnumerable<AppUser>> GetUsersAsync()
    {
       return await _context.Users
           .Include(p => p.Photos)
           .ToListAsync();
    }

    public async Task<AppUser> GetUserByIdAsync(int id)
    {
        return await _context.Users.FindAsync(id);
    }

    public async Task<AppUser> GetUserByUsernameAsync(string username)
    {
        return await _context.Users
            .Include(p => p.Photos)
            .SingleOrDefaultAsync(x => x.UserName == username);
    }

    public async Task<PageList<MemberDTO>> GetMembersAsync(UserParams userParams)
    {
        var query =  _context.Users
            .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
            //Add this because this list is not expected to be modifioed from the front end tiny more effiecent
            .AsNoTracking();
        return await PageList<MemberDTO>.CreateAsync(query, userParams.PageNumber, userParams.PageSize);
    }

    public async Task<MemberDTO> GetMemberAsync(string username)
    {
        return await _context.Users
            .Where(x => x.UserName == username)
            .ProjectTo<MemberDTO>(_mapper.ConfigurationProvider)
            .SingleOrDefaultAsync();
    }
}