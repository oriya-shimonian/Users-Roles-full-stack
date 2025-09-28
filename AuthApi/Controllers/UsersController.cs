/// <summary>
/// Users API: listing, creation, deletion, and role assignment.
/// Controllers remain thin; data shaping is done via EF projections to avoid JSON cycles.
/// </summary>
/// <remarks>
/// <para><b>Endpoints</b></para>
/// <list type="bullet">
///   <item><description><c>GET    /api/users</c> – list users (includes assigned roles)</description></item>
///   <item><description><c>POST   /api/users</c> – create user</description></item>
///   <item><description><c>DELETE /api/users/{id}</c> – delete user</description></item>
///   <item><description><c>POST   /api/users/{userId}/roles/{roleId}</c> – assign role to user</description></item>
///   <item><description><c>DELETE /api/users/{userId}/roles/{roleId}</c> – unassign role</description></item>
///   <item><description><c>GET    /api/users/{userId}/roles</c> – list roles of a user</description></item>
/// </list>
/// <para>Response codes follow REST conventions: 200/201/204 on success, 400/404/409 on errors.</para>
/// </remarks>
using AuthApi.Data;
using AuthApi.DTOs;
using AuthApi.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController(AppDbContext db) : ControllerBase
{
    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="dto">Payload containing <see cref="CreateUserDto.Username"/> and <see cref="CreateUserDto.Email"/>.</param>
    /// <returns>201 Created with the created user.</returns>
    /// <response code="201">User created successfully.</response>
    /// <response code="400">Validation failed (missing/invalid fields).</response>
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(CreateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = new User { Username = dto.Username, Email = dto.Email };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
    }

    /// <summary>
    /// Lists all users including their assigned roles.
    /// </summary>
    /// <returns>200 OK with users (and their roles).</returns>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        // Includes roles for a simplified UI binding
        var users = await db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .ToListAsync();
        return Ok(users);
    }

    /// <summary>
    /// Deletes a user by id.
    /// </summary>
    /// <param name="id">User identifier.</param>
    /// <returns>204 No Content on success; 404 if not found.</returns>
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }

    /// <summary>
    /// Assigns a role to a user (prevents duplicates).
    /// </summary>
    /// <param name="userId">User identifier.</param>
    /// <param name="roleId">Role identifier.</param>
    /// <returns>200 OK on success; 404 if user/role not found; 409 on duplicate assignment.</returns>
    /// <remarks>
    /// Duplicate assignment is prevented both in code and by the composite PK on <c>UserRoles(UserId, RoleId)</c>.
    /// </remarks>
    [HttpPost("{userId:int}/roles/{roleId:int}")]
    public async Task<IActionResult> AssignRole(int userId, int roleId)
    {
        var exists = await db.UserRoles.AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
        if (exists) return Conflict("Role already assigned to this user."); // prevent duplicate

        var userExists = await db.Users.AnyAsync(u => u.Id == userId);
        var roleExists = await db.Roles.AnyAsync(r => r.Id == roleId);
        if (!userExists || !roleExists) return NotFound("User or Role not found.");

        db.UserRoles.Add(new UserRole { UserId = userId, RoleId = roleId });
        await db.SaveChangesAsync();
        return Ok();
    }

    /// <summary>
    /// Returns all roles assigned to a specific user.
    /// </summary>
    /// <param name="userId">User identifier.</param>
    /// <returns>200 OK with the roles.</returns>
    [HttpGet("{userId:int}/roles")]
    public async Task<ActionResult<IEnumerable<Role>>> GetUserRoles(int userId)
    {
        var roles = await db.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role!)
            .ToListAsync();

        return Ok(roles);
    }

    /// <summary>
    /// Removes a role assignment from a user.
    /// </summary>
    /// <param name="userId">User identifier.</param>
    /// <param name="roleId">Role identifier.</param>
    /// <returns>204 No Content on success; 404 if the assignment does not exist.</returns>
    [HttpDelete("{userId:int}/roles/{roleId:int}")]
    public async Task<IActionResult> UnassignRole(int userId, int roleId)
    {
        var link = await db.UserRoles.FindAsync(userId, roleId);
        if (link is null) return NotFound();
        db.UserRoles.Remove(link);
        await db.SaveChangesAsync();
        return NoContent();
    }
}
