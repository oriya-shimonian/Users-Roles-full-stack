/// <summary>
/// Entity Framework Core DbContext for the Auth domain (Users, Roles, UserRoles).
/// </summary>
/// <remarks>
/// <para><b>Model configuration</b></para>
/// <list type="bullet">
///   <item><description>Composite PK on <c>UserRoles(UserId, RoleId)</c> prevents duplicate assignments.</description></item>
///   <item><description>Cascade delete from <c>Users</c>/<c>Roles</c> to <c>UserRoles</c>.</description></item>
///   <item><description>Unique index on <c>Role.RoleName</c>.</description></item>
/// </list>
/// </remarks>
using AuthApi.Models;
using Microsoft.EntityFrameworkCore;

namespace AuthApi.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    /// <summary>Users table.</summary>
    public DbSet<User> Users => Set<User>();

    /// <summary>Roles table.</summary>
    public DbSet<Role> Roles => Set<Role>();

    /// <summary>Link table for many-to-many between users and roles.</summary>
    public DbSet<UserRole> UserRoles => Set<UserRole>();

    /// <inheritdoc />
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        // Composite PK on the junction table
        modelBuilder.Entity<UserRole>()
            .HasKey(ur => new { ur.UserId, ur.RoleId });

        // Relations + cascade delete
        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.User)
            .WithMany(u => u.UserRoles)
            .HasForeignKey(ur => ur.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<UserRole>()
            .HasOne(ur => ur.Role)
            .WithMany(r => r.UserRoles)
            .HasForeignKey(ur => ur.RoleId)
            .OnDelete(DeleteBehavior.Cascade);

        // Unique role names
        modelBuilder.Entity<Role>()
            .HasIndex(r => r.RoleName)
            .IsUnique();
    }
}
