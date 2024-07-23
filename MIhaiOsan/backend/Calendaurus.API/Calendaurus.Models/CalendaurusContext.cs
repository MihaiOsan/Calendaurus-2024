using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendaurus.Models
{
    public class CalendaurusContext : DbContext
    {

        public CalendaurusContext()
        {
            
        }
        public CalendaurusContext(DbContextOptions<CalendaurusContext> options) : base(options)
        {
            
        }

        public virtual DbSet<CalendarEntry> CalendarEntries { get; set; }
        public virtual DbSet<User> User { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
            => optionsBuilder.UseSqlServer("Server=localhost;Database=Calendaurus;Trusted_Connection=True;Encrypt=false");
    }
}
