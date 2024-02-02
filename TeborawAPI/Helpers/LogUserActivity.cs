using Microsoft.AspNetCore.Mvc.Filters;
using TeborawAPI.Extensions;
using TeborawAPI.Interfaces;

namespace TeborawAPI.Helpers;

//This helper will intercept specified action or http request and apply a log entry to the user how initiated it
public class LogUserActivity: IAsyncActionFilter
{
    public async Task OnActionExecutionAsync(ActionExecutingContext context, ActionExecutionDelegate next)
    {
        //this waits until the api has completed it task then apply a log
        var resultContext = await next();
        
        //verify the user logged in and is authenticated
        if(!resultContext.HttpContext.User.Identity.IsAuthenticated) return;

        var userId = resultContext.HttpContext.User.GetUserId();

        var repo = resultContext.HttpContext.RequestServices.GetRequiredService<IUserRepository>();

        var user = await repo.GetUserByIdAsync(int.Parse(userId));
        user.LastActive = DateTime.Now;
        await repo.SaveALlAsync();
    }
}