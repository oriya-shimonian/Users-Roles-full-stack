/// <summary>
/// Request payload for creating a role.
/// </summary>
/// <remarks>
/// Validation:
/// <list type="bullet">
///   <item><description><c>RoleName</c> is required and must be at least 2 chars.</description></item>
/// </list>
/// </remarks>
using System.ComponentModel.DataAnnotations;

namespace AuthApi.DTOs;

public class CreateRoleDto
{
    /// <summary>
    /// The unique role name (e.g., "Admin", "Editor").
    /// </summary>
    [Required, MinLength(2)]
    public string RoleName { get; set; } = string.Empty;
}
