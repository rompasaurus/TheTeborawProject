using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TeborawAPI.Data;
using TeborawAPI.Entities;

namespace TeborawAPI.Controllers;

public class BuggyController : BaseAPIController
{
    private readonly DataContext _context;

    public BuggyController(DataContext context)
    {
        _context = context;
    }

    [Authorize]
    [HttpGet("auth")]
    public ActionResult<string> GetSecret()
    {
        return "secret text";
    }
    
    [HttpGet("not-found")]
    public ActionResult<AppUser> GetNotFound()
    {
        var thing = _context.Users.Find(-1);
        if(thing == null) return NotFound();
        return thing;
    }
    
    [HttpGet("server-error")]
    public ActionResult<string> GetServerError()
    {
        var thing = _context.Users.Find(-1);
        var thingToReturn = thing.ToString();
        return thingToReturn;
    }
    
    [HttpGet("bad-request")]
    public ActionResult<string> GetBadRequest()
    {
        return BadRequest("This was a bad request");
    }
    
    
    
}