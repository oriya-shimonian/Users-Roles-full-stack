using AuthApi.Data;
using AuthApi.DTOs;
using AuthApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class RolesController(AppDbContext db) : ControllerBase
{
    // POST /api/roles
    [HttpPost]
    public async Task<ActionResult<Role>> CreateRole(CreateRoleDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var role = new Role { RoleName = dto.RoleName.Trim() };
        db.Roles.Add(role);
        try
        {
            await db.SaveChangesAsync();
        }
        catch (DbUpdateException)
        {
            return Conflict("RoleName must be unique.");
        }
        return CreatedAtAction(nameof(GetRoles), new { id = role.Id }, role);
    }

    // GET /api/roles
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
    {
        return Ok(await db.Roles.ToListAsync());
    }

    // Endpoint נוסף: כל המשתמשים לפי שם תפקיד
    // GET /api/roles/{roleName}/users
    [HttpGet("{roleName}/users")]
    public async Task<ActionResult<IEnumerable<User>>> GetUsersByRole(string roleName)
    {
        var users = await db.UserRoles
            .Where(ur => ur.Role!.RoleName == roleName)
            .Select(ur => ur.User!)
            .Distinct()
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .ToListAsync();

        return Ok(users);
    }
}
