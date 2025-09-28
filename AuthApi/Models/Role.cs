using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models;

public class Role
{
    public int Id { get; set; }

    [Required, MinLength(2)]
    public string RoleName { get; set; } = string.Empty;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
