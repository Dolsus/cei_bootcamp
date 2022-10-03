using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace InvictusDashboard.Data.Entities
{
    public enum TaskPriority
    {
        high,
        standard,
        low
    }

    public class Task
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public int ParentTaskId { get; set; }

        public string Title { get; set; }
        public int Difficulty { get; set; }
        public int Priority { get; set; }
        public bool Completed { get; set; }

        public string Description { get; set; }
        public string StartDate { get; set; }
        public string DueDate { get; set; }
    }

}