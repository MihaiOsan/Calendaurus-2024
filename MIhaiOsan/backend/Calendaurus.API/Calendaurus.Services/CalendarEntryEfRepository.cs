using Calendaurus.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics.Metrics;
using System.Linq;
using System.Linq.Expressions;
using System.Text;
using System.Threading.Tasks;

namespace Calendaurus.Services
{
    public class CalendarEntryEfRepository : IRepository<CalendarEntry>
    {

        private readonly CalendaurusContext _context;

        public CalendarEntryEfRepository(CalendaurusContext context)
        {
            _context = context;
        }


        //verificare date duplicate
        public async Task<CalendarEntry> CreateAsync(CalendarEntry calendarEntry, Guid userID)
        {
            Console.WriteLine("Task<CalendarEntry> CreateAsyn");
            try
            {
                Console.WriteLine($"Creating new calendar entry for user: {userID}");

                calendarEntry.Id = Guid.NewGuid();
                calendarEntry.UserId = userID;

                Console.WriteLine($"New CalendarEntry ID: {calendarEntry.Id}, UserID: {calendarEntry.UserId}");

                var entry = await _context.Set<CalendarEntry>().AddAsync(calendarEntry);
                await _context.SaveChangesAsync();

                Console.WriteLine($"Calendar entry created successfully with ID: {entry.Entity.Id}");

                return entry.Entity;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception during creation of calendar entry: {ex.Message}");
                throw;
            }
        }

        //verificare daca userul curent a creat evenimentul
        public async Task DeleteAsync(Guid id)
        {
            var entry = await GetAsync(id);
            _context.Set<CalendarEntry>().Remove(entry);
            await _context.SaveChangesAsync();
        }

        public async Task<IEnumerable<CalendarEntry>> GetAllAsync()
        {
            return await _context.Set<CalendarEntry>().ToListAsync();
        }

        public async Task<CalendarEntry?> GetAsync(Guid id)
        {
            Console.WriteLine("CalendarEntryRepository");
            return await _context.Set<CalendarEntry>().FindAsync(id);
        }

        public async Task<IEnumerable<CalendarEntry>> GetAsync(Expression<Func<CalendarEntry, bool>> filter)
        {
            return await _context.Set<CalendarEntry>().Where(filter).ToListAsync();
        }


        // verificare date duplicate
        public async Task<CalendarEntry?> UpdateAsync(CalendarEntry calendarEntry)
        {
            var existingEntry = _context.Set<CalendarEntry>().Local.FirstOrDefault(x => x.Id == calendarEntry.Id);
            if (existingEntry != null)
            {
                _context.Entry(existingEntry).State = EntityState.Detached;
            }

            if (calendarEntry.User != null)
            {
                var existingUser = _context.User.Local.FirstOrDefault(u => u.Id == calendarEntry.User.Id);
                if (existingUser != null)
                {
                    _context.Entry(existingUser).State = EntityState.Detached;
                }
            }

            var entry = _context.Set<CalendarEntry>().Attach(calendarEntry);
            entry.State = EntityState.Modified;
            await _context.SaveChangesAsync();

            return entry.Entity;
        }

    }
}
