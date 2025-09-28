using AuthApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite; // required for executing the init script
using System.Text.Json.Serialization;

/// <summary>
/// ASP.NET Core entry point and app composition:
/// - Binds to PORT env (Render/containers)
/// - Registers EF Core (SQLite), Controllers, Swagger, CORS
/// - Performs idempotent DB bootstrap from /sql/init.sql when app.db is missing
/// - Runs the Web API
/// </summary>
var builder = WebApplication.CreateBuilder(args);

// --- Hosting / Port binding (container-friendly) ---
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// --- Services registration ---
builder.Services.AddDbContext<AppDbContext>(opt =>
    opt.UseSqlite(builder.Configuration.GetConnectionString("Default")));

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("frontend", p =>
        p.WithOrigins("http://localhost:5173")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

builder.Services.AddControllers()
    // Avoid reference loops when serializing Users ↔ Roles
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);

var app = builder.Build();

// --- Database bootstrap ---
// If app.db doesn't exist, try to execute /sql/init.sql to create schema & seed.
// Falls back to EnsureCreated() if the script is missing.
var contentRoot = app.Environment.ContentRootPath;
var dbPath = Path.Combine(contentRoot, "app.db");
var scriptPath = Path.GetFullPath(Path.Combine(contentRoot, "..", "sql", "init.sql"));

Console.WriteLine($"[DB INIT] dbPath: {dbPath}");
Console.WriteLine($"[DB INIT] scriptPath: {scriptPath}");

if (!File.Exists(dbPath))
{
    Directory.CreateDirectory(Path.GetDirectoryName(dbPath)!);
    var connString = $"Data Source={dbPath}";

    if (!File.Exists(scriptPath))
    {
        Console.WriteLine("[DB INIT] init.sql not found, falling back to EnsureCreated().");
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
        db.Database.EnsureCreated();
    }
    else
    {
        var sqlText = await File.ReadAllTextAsync(scriptPath);

        // Split by ';', strip "--" line comments, drop empty lines
        var statements = sqlText
            .Replace("\r\n", "\n")
            .Split(';')
            .Select(s => {
                var noComments = string.Join("\n",
                    s.Split('\n').Select(line => line.TrimStart())
                     .Where(line => !line.StartsWith("--")));
                return noComments.Trim();
            })
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();

        using var conn = new Microsoft.Data.Sqlite.SqliteConnection(connString);
        await conn.OpenAsync();

        // Enforce foreign keys
        using (var pragma = conn.CreateCommand())
        {
            pragma.CommandText = "PRAGMA foreign_keys=ON;";
            await pragma.ExecuteNonQueryAsync();
        }

        foreach (var stmt in statements)
        {
            using var cmd = conn.CreateCommand();
            cmd.CommandText = stmt + ";";
            await cmd.ExecuteNonQueryAsync();
        }

        Console.WriteLine($"[DB INIT] init.sql executed. Created {statements.Count} statements.");
    }
}
else
{
    Console.WriteLine("[DB INIT] Existing DB found. Skipping init.sql.");
    using var scope = app.Services.CreateScope();
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    // Safe no-op if schema already exists; does not drop data
    db.Database.EnsureCreated();
}
// --- End database bootstrap ---

// --- Middleware & endpoints ---
app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("frontend");
app.MapControllers();

app.Run();
