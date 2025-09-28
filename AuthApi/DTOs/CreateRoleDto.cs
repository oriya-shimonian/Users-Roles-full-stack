using System.ComponentModel.DataAnnotations;

namespace AuthApi.DTOs;

public class CreateRoleDto
{
    [Required, MinLength(2)]
    public string RoleName { get; set; } = string.Empty;
}
