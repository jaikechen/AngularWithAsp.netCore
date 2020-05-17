using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.Logging;
using System.IO;
using A.Data;
using A.Models;
using Microsoft.AspNetCore.Identity;

namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger _logger;
        UserManager<ApplicationUser> _userManager;
        RoleManager<IdentityRole> _roleManager; 
        public UserController(ApplicationDbContext context, 
            ILogger<GuideController> logger,
                UserManager<ApplicationUser> userManager, 
            RoleManager<IdentityRole> roleManager
            )
        {
            _context = context;
            _logger = logger;
              _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<UserDTO>>> Get(
            int pageSize, int pageNumber, string sortField, string sortOrder, string name)
        {
            if (sortField == "id")
            {
                sortField = "UserIDid";
            }
            var items = _context.ApplicationUser 
                .Where(x => string.IsNullOrWhiteSpace(name) 
                || x.FirstName.Contains(name)
                || x.LastName.Contains(name)
                );

            var result =  items.ToPaged(pageNumber, pageSize,sortField, sortOrder);
            var dtoResult = new PagedResult<UserDTO>
            {
                totalCount = result.totalCount,
                items = result.items
                .Select( x => new UserDTO(x)).ToList()
            };
            return dtoResult;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<UserDTO>> Get(int id)
        {
            var item = _context.Users.FirstOrDefault(x=>x.UserIDid ==id);
            if (item == null)
            {
                return NotFound();
            }
            return new UserDTO(item);
        }
    
        public async Task<ActionResult<PagedResult<UserDTO>>> UpdateStatusOrDelete(MultUpdateDeleteAction action)
        {
            var items = _context.Users.Where(x => action.ids.Contains(x.UserIDid));
            if (action.status == "delete")
            {
                _context.RemoveRange(items);
            }
            _context.SaveChanges();
            return items.Select(x=> new UserDTO(x))
                .ToPaged(0, action.ids.Length, "id", "asc");
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> Put([FromRoute]int id,[FromBody] Guide item)
        {
            if (id != item.id)
            {
                return BadRequest();
            }

            _context.Entry(item).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!Exists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }

        [HttpPost]
        public async Task<ActionResult<Guide>> Post(UserDTO item)
        {
            try
            {
                _context.AddUser(_userManager, _roleManager, item,true);
                return CreatedAtAction("Get", new { item.id }, item);
            }
            catch (System.Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        

        [HttpDelete("{id}")]
        public async Task<ActionResult<Guide>> Delete(int id)
        {
            var item = await _context.Guide.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }

            _context.Remove(item);
            await _context.SaveChangesAsync();

            return item;
        }

        private bool Exists(int id)
        {
            return _context.Guide.Any(e => e.id == id);
        }

        [HttpPost("[action]")]
        public bool sendMailApproval(int id)
        {
            return true;
        }

        [HttpPost("[action]")]
        public IFormFile ReturnFormFile(FileStreamResult result)
        {
            var ms = new MemoryStream();
            try
            {
                result.FileStream.CopyTo(ms);
                return new FormFile(ms, 0, ms.Length,"File","File");
            }
            catch (Exception e)
            {
                ms.Dispose();
                throw;
            }
            finally
            {
                ms.Dispose();
            }
        }


    }
}
