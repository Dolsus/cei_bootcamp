using System;
using System.Collections.Generic;
using InvictusDashboard.Data.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace InvictusDashboard.Data
{
    public class TaskContext: DbContext
    {
        private readonly IConfiguration _config;
        public DbSet<Task> Tasks { get; set; }

        public TaskContext(IConfiguration config)
        {
            _config = config;
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);

            optionsBuilder.UseSqlServer(_config["ConnectionStrings:TaskContextDb"]);
        }
    }
}
