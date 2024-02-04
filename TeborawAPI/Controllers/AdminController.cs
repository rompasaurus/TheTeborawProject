using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using TeborawAPI.Entities;

namespace TeborawAPI.Controllers;

public class AdminController : BaseAPIController
{
    private readonly UserManager<AppUser> _userManager;

    public AdminController(UserManager<AppUser> userManager)
    {
        _userManager = userManager;
    }
    
    [Authorize(Policy = "RequireAdminRole")]
    [HttpGet("users-with-roles")]
    public async Task<ActionResult> GetUsersWithRoles()
    {
        var users = await _userManager.Users
            .OrderBy(u => u.UserName)
            .Select(u => new
            {
                u.Id,
                Username = u.UserName,
                Roles = u.UserRoles.Select(r => r.Role.Name).ToList()
            })
            .ToListAsync();

        return Ok(users);
        // return Ok("Only Admins can see this");
    }
    
    //technically this should be a put request but need to return update list of roles 
    [Authorize(Policy = "RequireAdminRole")]
    [HttpPost("edit-roles/{username}")]
    public async Task<ActionResult> EditRoles(string username,[FromQuery] string roles)
    {
        if (string.IsNullOrEmpty(roles)) return BadRequest("You Must Select at least one role");

        var selectedRoles = roles.Split(",").ToArray();
        var user = await _userManager.FindByNameAsync(username);
        if(user == null) return NotFound();
        var userRoles = await _userManager.GetRolesAsync(user);

        var result = await _userManager.AddToRolesAsync(user, selectedRoles.Except(userRoles));
        
        if(!result.Succeeded) return BadRequest("Failed to add to roles");

        //find all the roles that the user has that are not list in the roles query parameter 
        //then remove said roles
        result = await _userManager.RemoveFromRolesAsync(user, userRoles.Except(selectedRoles));
        
        if(!result.Succeeded) return BadRequest("Failed to remove from roles");

        return Ok(await _userManager.GetRolesAsync(user));
    }
    

    [Authorize(Policy = "ModeratePhotoRole")]
    [HttpGet("photos-to-moderate")]
    public ActionResult GetPhotosForModeration()
    {
        return Ok("Admins or moderators can see this");
    }
}