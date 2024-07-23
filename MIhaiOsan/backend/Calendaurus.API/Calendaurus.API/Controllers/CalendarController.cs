using Calendaurus.Models;
using Calendaurus.Services;
using Ical.Net;
using Ical.Net.CalendarComponents;
using Ical.Net.DataTypes;
using Ical.Net.Serialization;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Linq.Expressions;

namespace Calendaurus.API.Controllers
{
    [Route("api/[controller]")]
    [Authorize]
    [ApiController]
    public class CalendarController : ControllerBase
    {
        private readonly IRepository<CalendarEntry> _repository;
        private readonly ICalendarService<CalendarEntry> _calendarService;
        private readonly IUserRepository _userRepository;

        public CalendarController(IRepository<CalendarEntry> repository, ICalendarService<CalendarEntry> calendarService, IUserRepository userRepository)
        {
            _repository = repository;
            _calendarService = calendarService;
            _userRepository = userRepository;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()

        {
            var currentUser = HttpContext.User.Identity.Name; //email
            var user = await _userRepository.GetUserByEmailAddress(currentUser);

            Console.WriteLine(currentUser);

            if (user == null)
            {
                _userRepository.CreateUserAsync(currentUser);
                return Ok(Enumerable.Empty<CalendarEntry>());
            }


            //pass user id
            //var results = await _repository.GetAsync(c => c.UserId == user.Id);

            // Read query parameters
            string searchTerm1 = Request.Query["searchTerm1"];
            int? searchTerm2 = null;
            if (int.TryParse(Request.Query["searchTerm2"], out int parsedSearchTerm2))
            {
                searchTerm2 = parsedSearchTerm2;
            }

            // Fetch and filter results based on the provided search terms
            var results = await _repository.GetAsync(c => c.UserId == user.Id &&
                (string.IsNullOrEmpty(searchTerm1) || (c.Title + " " + c.Location).Contains(searchTerm1)) &&
                (!searchTerm2.HasValue || c.Type == searchTerm2.Value));

            return Ok(results);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get([FromRoute] Guid id)
        {
            var currentUser = HttpContext.User.Identity!.Name;
            var user = await (_userRepository).GetUserByEmailAddress(currentUser);

            var result = await _repository.GetAsync(id);

            if (result == null)
            {
                return Ok(Enumerable.Empty<CalendarEntry>());
            }

            if (result.UserId != user.Id)
            {
                return Unauthorized();
            }
            return Ok(result);
        }

        [HttpPost]
        public async Task<IActionResult> Create([FromBody] CalendarEntry calendarEntry)
        {
            Console.WriteLine("In create");
            if (calendarEntry.User != null)
            {
                return BadRequest("calendar.User cannot be provided in the request");
            }

            var currentUser = HttpContext.User.Identity!.Name; // email
            var user = await _userRepository.GetUserByEmailAddress(currentUser);
            if (user is null)
            {
                return BadRequest("User not found");
            }

            var result = await _calendarService.CreateAsync(calendarEntry, user.Id);

            if (result is null)
            {
                return BadRequest("Failed to create calendar entry");
            }

            return Ok(result);
        }

        [HttpPost("create-recurring")]
        public async Task<IActionResult> CreateRecurring([FromBody] CalendarEntry calendarEntry, [FromQuery] string recurentType, [FromQuery] int recurentNr)
        {
            var currentUser = HttpContext.User.Identity.Name;
            var user = await _userRepository.GetUserByEmailAddress(currentUser);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            var entriesToCreate = CreateRecurringEntries(calendarEntry, recurentType, recurentNr, user.Id);

            foreach (var entry in entriesToCreate)
            {
                await _repository.CreateAsync(entry, user.Id);
            }

            return Ok();
        }

        private List<CalendarEntry> CreateRecurringEntries(CalendarEntry calendarEntry, string recurentType, int recurentNr, Guid userId)
        {
            var entries = new List<CalendarEntry>();
            var startTime = calendarEntry.Timestamp;
            var endTime = calendarEntry.EndTime ?? startTime.AddHours(2);

            for (int i = 0; i < recurentNr; i++)
            {
                var entryDateTime = startTime.Add(TimeSpanForRecurrence(recurentType, i));


                var entry = new CalendarEntry
                {
                    Id = Guid.NewGuid(),
                    Title = calendarEntry.Title,
                    Type = calendarEntry.Type,
                    Location = calendarEntry.Location,
                    Timestamp = entryDateTime,
                    EndTime = entryDateTime.Add(endTime - startTime),
                    UserId = userId,
                    CreatedTimeUtc = DateTimeOffset.UtcNow,
                    UpdatedTimeUtc = DateTimeOffset.UtcNow
                };
                entries.Add(entry);
            }

            return entries;
        }

        private TimeSpan TimeSpanForRecurrence(string recurrenceType, int iteration)
        {
            return recurrenceType switch
            {
                "weekly" => TimeSpan.FromDays(7 * iteration),
                "biweekly" => TimeSpan.FromDays(14 * iteration),
                _ => TimeSpan.Zero
            };
        }

        [HttpPut("{id}")] 
        public async Task<IActionResult> Update([FromRoute]Guid id, [FromBody] CalendarEntry calendarEntry)
        {
            Console.WriteLine("in update");
            if (!id.Equals(calendarEntry.Id)) 
            {
                return BadRequest();
            }

            var currentUser = HttpContext.User.Identity!.Name;
            var user = await _userRepository.GetUserByEmailAddress(currentUser);

            if (!user.Id.Equals(calendarEntry.UserId)) 
            {
                Console.WriteLine(user.Id+ " " + calendarEntry.UserId);
                return Unauthorized();
            }

            var result = await _repository.UpdateAsync(calendarEntry);
            return Ok(result);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete([FromRoute] Guid id)
        {
            await _repository.DeleteAsync(id);
            return NoContent();
        }

        [HttpGet("export-ical")]
        public async Task<IActionResult> ExportToIcal()
        {
            var currentUser = HttpContext.User.Identity.Name;
            var user = await _userRepository.GetUserByEmailAddress(currentUser);

            if (user == null)
            {
                return BadRequest("User not found");
            }

            // Fetch the user's calendar entries
            var calendarEntries = await _repository.GetAsync(c => c.UserId == user.Id);

            var calendar = new Calendar();

            foreach (var entry in calendarEntries)
            {
                String type = "";
                switch (entry.Type)
                {
                    case 0: // CURS
                        type = "LECTURE";
                        break;
                    case 1: // LAB
                        type = "LAB";
                        break;
                    case 2: // SEMINAR
                        type = "SEMINAR";
                        break;
                    default:
                        type = "";
                        break;
                }

                var calendarEvent = new CalendarEvent
                {
                    //add 2 hours to each entry, not sure of the timezone
                    Start = new CalDateTime(entry.Timestamp.DateTime.AddHours(2)),
                    End = new CalDateTime(entry.Timestamp.DateTime.AddHours(2)),
                    Summary = entry.Title,
                    Description = type,
                    Location = entry.Location
                };

                // added just 1 hour
                //calendarEvent.Start.TzId = "Europe/Bucharest";
                //calendarEvent.End.TzId = "Europe/Bucharest";

                calendar.Events.Add(calendarEvent);
            }

            // Serialize the calendar to an iCal file
            var serializer = new CalendarSerializer();
            var icalString = serializer.SerializeToString(calendar);

            var bytes = System.Text.Encoding.UTF8.GetBytes(icalString);
            var result = new FileContentResult(bytes, "text/calendar")
            {
                FileDownloadName = "calendaurus.ics"
            };

            return result;
        }

    }
}
