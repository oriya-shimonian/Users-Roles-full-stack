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
    // POST /api/users
    [HttpPost]
    public async Task<ActionResult<User>> CreateUser(CreateUserDto dto)
    {
        if (!ModelState.IsValid) return BadRequest(ModelState);

        var user = new User { Username = dto.Username, Email = dto.Email };
        db.Users.Add(user);
        await db.SaveChangesAsync();
        return CreatedAtAction(nameof(GetUsers), new { id = user.Id }, user);
    }

    // GET /api/users
    [HttpGet]
    public async Task<ActionResult<IEnumerable<User>>> GetUsers()
    {
        // מחזירים גם את התפקידים שהוקצו (לא חובה, אבל נוח ל-UI)
        var users = await db.Users
            .Include(u => u.UserRoles)
            .ThenInclude(ur => ur.Role)
            .ToListAsync();
        return Ok(users);
    }

    // DELETE /api/users/{id}
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteUser(int id)
    {
        var user = await db.Users.FindAsync(id);
        if (user is null) return NotFound();
        db.Users.Remove(user);
        await db.SaveChangesAsync();
        return NoContent();
    }

    // POST /api/users/{userId}/roles/{roleId} - שיוך תפקיד למשתמש
    [HttpPost("{userId:int}/roles/{roleId:int}")]
    public async Task<IActionResult> AssignRole(int userId, int roleId)
    {
        var exists = await db.UserRoles.AnyAsync(ur => ur.UserId == userId && ur.RoleId == roleId);
        if (exists) return Conflict("Role already assigned to this user."); // מניעת שיוך כפול

        var userExists = await db.Users.AnyAsync(u => u.Id == userId);
        var roleExists = await db.Roles.AnyAsync(r => r.Id == roleId);
        if (!userExists || !roleExists) return NotFound("User or Role not found.");

        db.UserRoles.Add(new UserRole { UserId = userId, RoleId = roleId });
        await db.SaveChangesAsync();
        return Ok();
    }

    // GET /api/users/{userId}/roles - רשימת התפקידים של משתמש
    [HttpGet("{userId:int}/roles")]
    public async Task<ActionResult<IEnumerable<Role>>> GetUserRoles(int userId)
    {
        var roles = await db.UserRoles
            .Where(ur => ur.UserId == userId)
            .Select(ur => ur.Role!)
            .ToListAsync();

        return Ok(roles);
    }
}
