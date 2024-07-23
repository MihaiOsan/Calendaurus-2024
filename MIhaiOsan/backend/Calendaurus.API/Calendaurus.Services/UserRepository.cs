using Calendaurus.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendaurus.Services
{

    public interface IUserRepository 
    {
        Task<User> GetUserByEmailAddress(string email);

        Task<User> CreateUserAsync(string email);
    }
    public class UserRepository : IUserRepository
    {

        private readonly CalendaurusContext _calendaurusContext;

        public UserRepository(CalendaurusContext calendaurusContext)
        {
            _calendaurusContext = calendaurusContext;  
        }
        public async Task<User?> GetUserByEmailAddress(string email)
        {
            return await _calendaurusContext.User.FirstOrDefaultAsync(u => u.Email == email);
        }

        public async Task<User> CreateUserAsync(string email)
        {
            User user = new User();
            user.Id = Guid.NewGuid();
            user.Email = email;
            var entry = await _calendaurusContext.Set<User>().AddAsync(user);
            await _calendaurusContext.SaveChangesAsync();
            return entry.Entity;
        }
    }
}
