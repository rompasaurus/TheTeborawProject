using Microsoft.AspNetCore.Mvc;
using TeborawAPI.Helpers;

namespace TeborawAPI.Controllers;


//this decorator ensure the LogUser Activity gets applied in the middle
//of every api request allowng the user activity to be logged and last active time updated
[ServiceFilter(typeof(LogUserActivity))]
[ApiController]
[Route("api/[controller]")]
public class BaseAPIController: ControllerBase
{
    
}