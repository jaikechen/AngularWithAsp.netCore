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
namespace Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GuideController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly ILogger _logger;
        public GuideController(ApplicationDbContext context,  ILogger<GuideController> logger)
        {
            _context = context;
            _logger = logger;
        }

        [HttpGet]
        public async Task<ActionResult<PagedResult<Guide>>> Get(
            int pageSize, int pageNumber, string sortField, string sortOrder, string name)
        {
            var items = _context.Guide 
                .Where(x => string.IsNullOrWhiteSpace(name) 
                || x.firstName.Contains(name)
                || x.lastName.Contains(name)
                ) ;
            return items.ToPaged(pageNumber, pageSize,sortField, sortOrder);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Guide>> Get(int id)
        {
            var item = await _context.Guide.FindAsync(id);
            if (item == null)
            {
                return NotFound();
            }
            return item;
        }
     

        public async Task<ActionResult<PagedResult<Guide>>> UpdateStatusOrDelete(MultUpdateDeleteAction action)
        {
            var items = _context.Guide.Where(x => action.ids.Contains(x.id));
            if (action.status == "delete")
            {
                _context.RemoveRange(items);
            }
            else
            {
                items.ToList().ForEach(x => x.firstName = action.status);
            }
            _context.SaveChanges();
            return items.ToPaged(0, action.ids.Length, "id", "asc");
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
        public async Task<ActionResult<Guide>> Post(Guide item)
        {
      
            _context.Add(item);
            await _context.SaveChangesAsync();

            return CreatedAtAction("Get", new {item.id }, item);
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
