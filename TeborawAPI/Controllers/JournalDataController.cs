using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TeborawAPI.Data;
using TeborawAPI.Entities;
using TeborawAPI.Extensions;
using TeborawAPI.Interfaces;
using TeborawAPI.Models;
using TeborawAPI.Services;

namespace TeborawAPI.Controllers;

[Authorize]
public class JournalDataController : BaseAPIController
{
    private readonly ILogger<JournalDataController> _logger;
    private readonly UserManager<AppUser> _userManager;
    private readonly DataContext _context;
    // private readonly UserService _userService;
    // private readonly ApplicationDbContext _journalContext;
    private readonly ITokenService _tokenService;
    private readonly IMapper _mapper;
    private readonly IUnitOfWork _unitOfWork;

    public JournalDataController(ILogger<JournalDataController> logger, DataContext context,UserManager<AppUser> userManager, IUnitOfWork unitOfWork, ITokenService tokenService, IMapper mapper)
    {
        _logger = logger;
        _userManager = userManager;
        _context = context;
        _unitOfWork = unitOfWork;
    }

    [HttpGet]
    public async Task<IEnumerable<Journal>> GetAsync()
    {
        var user = await _userManager.GetUserAsync(User);
        var username = User.GetUserName();
        var journal = new Journal()
        {
            Title = "New title",
            DateCreated = DateTime.Today,
            LastUpdates = DateTime.Now,
            UserID = user?.Id,
        };
        var journalList = new List<Journal>();
        journalList.Add(journal);
        return journalList;
    }
    
    [HttpGet("RetrieveJournalLatestRaw")]
    public async Task<JournalRaw> GetJournalLatestRaw()
    {
        var userId = _userManager.GetUserId(HttpContext.User);
        var journalRaw =  _unitOfWork.JournalRepository.getLatestJournalRaw(userId);
        
        // var journalRaw = _context.JournalRaw
        //     .Where(j => j.UserId == userId)
        //     .OrderByDescending(j => j.LastUpdated)
        //     .FirstOrDefault() ?? new JournalRaw();
        return await journalRaw;
    }
    
    [HttpGet("RetrieveUserJournalListRaw")]
    public async Task<List<JournalRaw>> GetUserJournalListRaw()
    {
        //var userId = _userService.OnGetLoggedInUserId(HttpContext);
        var userId = _userManager.GetUserId(HttpContext.User);
        var journalListRaw =  _unitOfWork.JournalRepository.getUserJournalListRaw(userId);
        // var journalListRaw = _context.JournalRaw
        //     .Where(j => j.UserId == userId)
        //     .OrderBy(j => j.LastUpdated)
        //     .ToList();
        return await journalListRaw;
    }
    
    //Rewrite to use repository pattern
    [HttpPost("SaveJournalRAW")]
    public async Task<JournalRaw> SaveJournalRaw([FromBody] JournalRaw request)
    {
        var journalRaw = request;
        var userId = _userManager.GetUserId(HttpContext.User);
        //var userId = _userService.OnGetLoggedInUserId(HttpContext);
        //var userName = _userService.OnGetLoggedInUserName(HttpContext);
        var username = User.GetUserName();
        request.UserId = userId;
        request.UserName = username;
        JournalRaw existingJRaw = null;
        if (request.JournalRawId != 0)
        {
            existingJRaw = _context.JournalRaw.First(j => j.JournalRawId == request.JournalRawId);
        }

        if (existingJRaw != null)
        {
            existingJRaw.Content = request.Content;
            existingJRaw.Title = request.Title;
            existingJRaw.TopicTree = request.TopicTree;
            journalRaw = existingJRaw;
        }
        else
        {
            journalRaw = _context.JournalRaw.Add(request).Entity;
            
        }
        journalRaw.LastUpdated = journalRaw.LastUpdated.ToUniversalTime();
        journalRaw.LastUpdated = journalRaw.LastUpdated.ToUniversalTime();
        _context.SaveChanges();
        return journalRaw;
    
    }
    
    //Todo :Use repository 
    [HttpPost]
    public async Task<JournalRaw> SaveJournalDataAsync([FromBody] Object request)
    {
        var user = await _userManager.GetUserAsync(User);
        var userName = user?.UserName;
        var journalR = new JournalRaw();
        return journalR;
    
    }
    

}