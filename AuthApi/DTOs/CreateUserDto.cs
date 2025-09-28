using System.ComponentModel.DataAnnotations;

namespace AuthApi.DTOs;

public class CreateUserDto
{
    [Required, MinLength(2)]
    public string Username { get; set; } = string.Empty;

    [Required, EmailAddress]
    public string Email { get; set; } = string.Empty;
}
