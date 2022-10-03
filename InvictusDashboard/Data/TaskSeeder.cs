using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Text.Json;
using InvictusDashboard.Data.Entities;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace InvictusDashboard.Data
{
    public class TaskSeeder
    {
        private readonly TaskContext _ctx;
        private readonly IWebHostEnvironment _env;

        public TaskSeeder(TaskContext ctx, IWebHostEnvironment env)
        {
            _ctx = ctx;
            _env = env;
        }

        private static void RunSeeding(IWebHost host)
        {
            var seeder = host.Services.GetService<TaskSeeder>();
            seeder.Seed();
        }

        public void Seed()
        {
            _ctx.Database.EnsureCreated();

            if (!_ctx.Tasks.Any())
            {
                var seedDataPath = Path.Combine(_env.ContentRootPath, "Data/taskData.json");

                //dates stored in string format of "dd/mm/yyyy" here and will be changed to Date format in typescripts
                var json = File.ReadAllText(seedDataPath);
                List<Task> tasks = JsonSerializer.Deserialize<List<Task>>(json);

                _ctx.Tasks.AddRange(tasks);
                try
                {
                    _ctx.SaveChanges();
                }
                catch (DbUpdateConcurrencyException ex)
                {
                    Console.Write(ex.InnerException);
                }
            }
        }


    }
}