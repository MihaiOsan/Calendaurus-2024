using System.ComponentModel.DataAnnotations;

namespace Calendaurus.Models
    
{
    public class CalendarEntry
    {
        public Guid Id { get; set; }

        [StringLength(200)]
        public string Title { get; set; }
        public DateTimeOffset Timestamp { get; set; }
        public DateTimeOffset? EndTime { get; set; }
        public DateTimeOffset? CreatedTimeUtc { get; set; }
        public DateTimeOffset? UpdatedTimeUtc { get; set; }
        public short Type { get; set; }
        public string Location { get; set; } = default!;

        public Guid UserId { get; set; }
        public User? User { get; set; }

    }
}
