using Calendaurus.Models;
using System.Linq.Expressions;

namespace Calendaurus.Services
{
    public class CalendarEntryRepository : IRepository<CalendarEntry>
    {

        private static List<CalendarEntry> _calendarEntries = new List<CalendarEntry>();
        public Task<CalendarEntry> CreateAsync(CalendarEntry calendarEntry, Guid userID)
        {
            calendarEntry.Id = Guid.NewGuid();
            calendarEntry.UserId = userID;
            _calendarEntries.Add(calendarEntry);
            return Task.FromResult(calendarEntry);
        }

        public Task DeleteAsync(Guid id)
        {
            _calendarEntries.RemoveAll(x => x.Id == id);
            return Task.CompletedTask;
        }

        public Task<IEnumerable<CalendarEntry>> GetAllAsync()
        {
            return Task.FromResult(_calendarEntries.AsEnumerable());
        }

        public Task<CalendarEntry?> GetAsync(Guid id)
        {
            var item = _calendarEntries.Find(x => x.Id == id);
            return Task.FromResult(item);
        }

        public async Task<IEnumerable<CalendarEntry>> GetAsync(Expression<Func<CalendarEntry, bool>> filter)
        {
            var entries = _calendarEntries.Where(filter.Compile());
            return (IEnumerable<CalendarEntry>)Task.FromResult(entries);
        }

        public Task<CalendarEntry?> UpdateAsync(CalendarEntry calendarEntry)
        {
            var item = _calendarEntries.Find(x => x.Id == calendarEntry.Id);
            if (item != null) 
            {
                _calendarEntries.Remove(item);
                _calendarEntries.Add(calendarEntry);
                return Task.FromResult(calendarEntry);
            }
            return Task.FromResult(item);
        }
    }
}
