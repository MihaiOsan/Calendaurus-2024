using Calendaurus.Models;
using System.Linq.Expressions;

namespace Calendaurus.Services
{
    public interface IRepository<T> where T : class
    {
        Task<IEnumerable<T>> GetAllAsync();
        Task<T?> GetAsync(Guid id);

        Task<IEnumerable<T>> GetAsync(Expression<Func<T,bool>> filter);
        Task<T> CreateAsync(CalendarEntry calendarEntry, Guid userID);
        Task<T?> UpdateAsync(CalendarEntry calendarEntry);  
        Task DeleteAsync(Guid id);

    }
}
