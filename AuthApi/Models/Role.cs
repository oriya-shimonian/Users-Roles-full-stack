using System.ComponentModel.DataAnnotations;

namespace AuthApi.Models;

/// <summary>
/// Application role (e.g., Admin, Editor). Each role name is unique.
/// </summary>
public class Role
{
    /// <summary>Primary key.</summary>
    public int Id { get; set; }

    /// <summary>Unique role name (min length 2).</summary>
    [Required, MinLength(2)]
    public string RoleName { get; set; } = string.Empty;

    /// <summary>
    /// Navigation collection for the many-to-many relation with users
    /// via <see cref="UserRole"/>.
    /// </summary>
    public ICollection<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
