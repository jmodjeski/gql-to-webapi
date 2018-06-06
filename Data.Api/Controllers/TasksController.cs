using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Data.Api.Models;

namespace Data.Api.Controllers
{
    [Route("api/tasks")]
    [ApiController]
    public class TasksController : ControllerBase
    {
        private readonly DataContext _context;

        public TasksController(DataContext context)
        {
            _context = context;
        }

        // GET api/tasks
        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> Get()
        {
            return _context.Tasks.ToList();
        }

        // GET api/tasks/5
        [HttpGet("{id}")]
        public ActionResult<TaskItem> Get(long id)
        {
            var task = _context.Tasks.Find(id);
            if (task == null) return NotFound();
            return task;
        }

        // POST api/tasks
        [HttpPost]
        public ActionResult Post([FromBody] TaskItem value)
        {
            _context.Tasks.Add(value);
            _context.SaveChanges();
            return CreatedAtAction("Get", new { id = value.Id }, null);
        }

        // PUT api/tasks/5
        [HttpPut("{id}")]
        public void Put(long id, [FromBody] TaskItem value)
        {
            value.Id = id;
            _context.Update(value);
            _context.SaveChanges();
        }

        // DELETE api/tasks/5
        [HttpDelete("{id}")]
        public void Delete(long id)
        {
            var task = _context.Tasks.Find(id);
            _context.Tasks.Remove(task);
            _context.SaveChanges();
        }
    }
}
