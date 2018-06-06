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
        // GET api/tasks
        [HttpGet]
        public ActionResult<IEnumerable<TaskItem>> Get()
        {
            using(var db = new DataContext()) {
                return db.Tasks;
            }
        }

        // GET api/tasks/5
        [HttpGet("{id}")]
        public ActionResult<TaskItem> Get(int id)
        {
            using(var db = new DataContext()) {
                var task = db.Tasks.Find(id);
                if (task == null) return NotFound();
                return task;
            }
        }

        // POST api/tasks
        [HttpPost]
        public void Post([FromBody] TaskItem value)
        {
            using(var db = new DataContext()) {
                db.Tasks.Add(value);
                db.SaveChanges();
            }
        }

        // PUT api/tasks/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] TaskItem value)
        {
            using(var db = new DataContext()) {
                value.Id = id;
                db.Update(value);
                db.SaveChanges();
            }
        }

        // DELETE api/tasks/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
            using(var db = new DataContext()) {
                var task = db.Tasks.Find(id);
                db.Tasks.Remove(task);
                db.SaveChanges();
            }
        }
    }
}
