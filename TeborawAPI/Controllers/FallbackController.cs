using Microsoft.AspNetCore.Mvc;

namespace TeborawAPI.Controllers;

//Allows kestrel to let angular handle routing when no controller endpoint exist for route
public class FallbackController: Controller
{
    public ActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot/browser", "index.html"), "text/HTML");
    }
}