using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace TeborawAPI.Entities;

public class Group
{
    public Group(string name)
    {
        this.name = name;
    }
    [Key] public string name { get; set; }
    public ICollection<Connection> Connections { get; set; } = new List<Connection>();


}