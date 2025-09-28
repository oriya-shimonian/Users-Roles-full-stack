namespace AuthApi.Models;

/// <summary>
/// Junction entity for the many-to-many relation between <see cref="User"/>
/// and <see cref="Role"/>. The composite key (UserId, RoleId) is configured
/// in the DbContext.
/// </summary>
public class UserRole
{
    /// <summary>FK to <see cref="User"/>.</summary>
    public int UserId { get; set; }

    /// <summary>FK to <see cref="Role"/>.</summary>
    public int RoleId { get; set; }

    /// <summary>Navigation to user.</summary>
    public User? User { get; set; }

    /// <summary>Navigation to role.</summary>
    public Role? Role { get; set; }
}
