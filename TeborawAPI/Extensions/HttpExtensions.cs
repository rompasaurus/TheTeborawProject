using System.Text.Json;
using TeborawAPI.Helpers;
using JsonSerializer = System.Text.Json.JsonSerializer;

namespace TeborawAPI.Extensions;

public static class HttpExtensions
{
    public static void AddPaginationHeader(this HttpResponse response, PaginationHeader header)
    {
        var jsonOptions = new JsonSerializerOptions { PropertyNamingPolicy = JsonNamingPolicy.CamelCase };
        //Creates the custom header with the pagination data
        response.Headers.Add("Pagination", JsonSerializer.Serialize(header,jsonOptions));
        //Cors needs updated to allow for this nonsense as well
        response.Headers.Add("Access-Control-Expose-Headers", "Pagination");
    }
}