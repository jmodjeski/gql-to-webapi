using System;

namespace Data.Api.Models
{
    public class TaskItem
    {
        public long Id { get; set; }
        public string Name { get; set; }
        public bool IsComplete { get; set; }
        public DateTimeOffset CompletionDate { get; set; }
    }
}