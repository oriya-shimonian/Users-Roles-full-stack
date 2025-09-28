using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models;

/// <summary>
/// Application user with a username and email.
/// </summary>
public class User
{
    /// <summary>Primary key.</summary>
    public int Id { get; set; }

    /// <summary>Display name (min length 2).</summary>
    [Required, MinLength(2)]
    public string Username { get; set; } = string.Empty;

    /// <summary>Valid email address (server-side validated).</summary>
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;

    /// <summary>
    /// Navigation collection for the many-to-many relation with roles
    /// via <see cref="UserRole"/>.
    /// </summary>
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
