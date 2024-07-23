using Calendaurus.Models;

namespace Calendaurus.Services
{
    public interface ICalendarService<T> where T : class
    {
        public Task<T> CreateAsync(CalendarEntry calendarEntry, Guid userID);
        public Task<T> UpdateAsync(CalendarEntry calendarEntry);
        public Task DeleteAsync(Guid id);
    }
}
