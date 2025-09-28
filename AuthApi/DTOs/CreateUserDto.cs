/// <summary>
/// Request payload for creating a user.
/// </summary>
/// <remarks>
/// Validation:
/// <list type="bullet">
///   <item><description><c>Username</c> is required (min length 2).</description></item>
///   <item><description><c>Email</c> must be a valid email address.</description></item>
/// </list>
/// </remarks>
using System.ComponentModel.DataAnnotations;

namespace AuthApi.DTOs;

public class CreateUserDto
{
    /// <summary>User display name.</summary>
    [Required, MinLength(2)]
    public string Username { get; set; } = string.Empty;

    /// <summary>User email (validated by <see cref="EmailAddressAttribute"/>).</summary>
    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}
