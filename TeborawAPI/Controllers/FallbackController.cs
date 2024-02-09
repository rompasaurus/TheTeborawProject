using Microsoft.AspNetCore.Mvc;

namespace TeborawAPI.Controllers;

public class FallbackController: Controller
{
    public ActionResult Index()
    {
        return PhysicalFile(Path.Combine(Directory.GetCurrentDirectory(),
            "wwwroot/browser", "index.html"), "text/HTML");
    }
}