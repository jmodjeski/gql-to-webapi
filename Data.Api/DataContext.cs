using Microsoft.EntityFrameworkCore;
using Data.Api.Models;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

namespace Data.Api {

    public class DataContext : DbContext
    {
        // When used with ASP.net core, add these lines to Startup.cs
        //   var connectionString = Configuration.GetConnectionString("BlogContext");
        //   services.AddEntityFrameworkNpgsql().AddDbContext<BlogContext>(options => options.UseNpgsql(connectionString));
        // and add this to appSettings.json
        // "ConnectionStrings": { "BlogContext": "Server=localhost;Database=blog" }

        public DataContext(DbContextOptions<DataContext> options) : base(options) { }

        public DbSet<TaskItem> Tasks { get; set; }     
    }

}
