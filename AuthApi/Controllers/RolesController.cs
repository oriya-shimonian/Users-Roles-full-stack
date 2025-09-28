/// <summary>
/// Roles API: list/create roles and query users by role.
/// </summary>
/// <remarks>
/// <para><b>Endpoints</b></para>
/// <list type="bullet">
///   <item><description><c>GET  /api/roles</c> – get all roles</description></item>

///   <item><description><c>POST /api/roles</c> – create a new role</description></item>
///   <item><description><c>GET  /api/roles/{roleName}/users</c> – list users that have the given role</description></item>
/// </list>
/// <para>Notes:</para>
/// <list type="number">
///   <item>
///     <description><c>RoleName</c> is unique (DB unique index). Attempts to create a duplicate return <c>409 Conflict</c>.</description>
///   </item>
///   <item>
///     <description>Responses follow REST conventions: 200 OK / 201 Created / 409 Conflict.</description>
///   </item>
/// </list>
/// </remarks>
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
    /// <summary>
    /// Creates a new role.
    /// </summary>
    /// <param name="dto">Payload containing <see cref="CreateRoleDto.RoleName"/>.</param>
    /// <returns>201 Created with the created <see cref="Role"/> or 409 Conflict if the name exists.</returns>
    /// <response code="201">Role created successfully.</response>
    /// <response code="400">Validation failed (e.g., empty/too short name).</response>
    /// <response code="409">A role with the same name already exists.</response>
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
            // Unique index on RoleName enforces uniqueness at the DB level
            return Conflict("RoleName must be unique.");
        }
        return CreatedAtAction(nameof(GetRoles), new { id = role.Id }, role);
    }

    /// <summary>
    /// Returns all roles.
    /// </summary>
    /// <returns>200 OK with the list of roles.</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Role>>> GetRoles()
    {
        return Ok(await db.Roles.ToListAsync());
    }

    /// <summary>
    /// Returns all users that are assigned to the specified role.
    /// </summary>
    /// <param name="roleName">The role name (case-sensitive as stored in DB).</param>
    /// <returns>200 OK with the users list (can be empty).</returns>
    /// <remarks>
    /// Example: <c>GET /api/roles/Admin/users</c>
    /// </remarks>
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
