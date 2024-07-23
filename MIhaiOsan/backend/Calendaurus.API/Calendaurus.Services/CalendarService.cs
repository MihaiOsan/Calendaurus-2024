using Calendaurus.Models;

namespace Calendaurus.Services
{
    public class CalendarService : ICalendarService<CalendarEntry>
    {

        private readonly IRepository<CalendarEntry> _repository;

        public CalendarService(IRepository<CalendarEntry> repository)
        {
            _repository = repository;
        }

        public async Task<CalendarEntry> CreateAsync(CalendarEntry calendarEntry, Guid userID)
        {
            var calendarEntries = await _repository.GetAsync(x => x.Location == calendarEntry.Location && (calendarEntry.Timestamp >= x.Timestamp && calendarEntry.EndTime <= x.EndTime));

            if (calendarEntries.Any())
                return null;

            calendarEntry.Id = Guid.NewGuid();
            return await _repository.CreateAsync(calendarEntry, userID);
        }

        public async Task DeleteAsync(Guid id)
        {
            //TODO: find some validations
            await _repository.DeleteAsync(id);
        }

        public async Task<CalendarEntry> UpdateAsync(CalendarEntry calendarEntry)
        {
            if (calendarEntry == null)
                throw new ArgumentNullException("Calendar entry must not be null");

            var item = await _repository.GetAsync(calendarEntry.Id);

            if (item == null)
                throw new ArgumentException("Calendar entry not found");
            if (calendarEntry.Title == null)
                throw new ArgumentNullException("Calendar entry title must not be null");
            if (calendarEntry.Location == null)
                throw new ArgumentNullException("Calendar entry location must not be null");
            if (calendarEntry.Timestamp > calendarEntry.EndTime)
                throw new ArgumentException("Calendar entry timestamp must precede the endtime");
            return await _repository.UpdateAsync(calendarEntry);
        }
    }
}
