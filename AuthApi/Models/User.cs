using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models;

public class User
{
    public int Id { get; set; }

    [Required, MinLength(2)]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
