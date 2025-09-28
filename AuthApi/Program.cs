using AuthApi.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Data.Sqlite; // ← חשוב
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

// PORT (כמו קודם)
var port = Environment.GetEnvironmentVariable("PORT") ?? "5000";
builder.WebHost.UseUrls($"http://0.0.0.0:{port}");

// Services
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
    .AddJsonOptions(o =>
        o.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles);
var app = builder.Build();

// --- אתחול DB אוטומטי מסקריפט SQL אם הקובץ לא קיים ---
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

        // מפרקים לפקודות (על ;), מסירים הערות "--", מרוקנים שורות ריקות
        var statements = sqlText
            .Replace("\r\n", "\n")
            .Split(';')
            .Select(s => {
                var noComments = string.Join("\n",
                    s.Split('\n').Select(line => line.TrimStart())
                     .Where(line => !line.StartsWith("--"))  // הסר הערות
                );
                return noComments.Trim();
            })
            .Where(s => !string.IsNullOrWhiteSpace(s))
            .ToList();

        using var conn = new Microsoft.Data.Sqlite.SqliteConnection(connString);
        await conn.OpenAsync();

        // להבטיח מפתחות זרים
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
    db.Database.EnsureCreated(); // לא מזיק; לא ימחוק נתונים
}
// --- סוף אתחול ---


app.UseSwagger();
app.UseSwaggerUI();

app.UseCors("frontend");
app.MapControllers();
app.Run();
