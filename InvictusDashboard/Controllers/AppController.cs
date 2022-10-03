using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using InvictusDashboard.Data;
using Microsoft.AspNetCore.Mvc;

namespace InvictusDashboard.Controllers
{
    public class AppController : Controller
    {
        private readonly TaskContext _context;
        public AppController(TaskContext context)
        {
            _context = context;
        }

        public IActionResult Index()
        {
            //grab stuff from ef table
            var tasks = from task in _context.Tasks
                        orderby task.Id
                        select task;

            return View(tasks.ToList());
        }

    }
}
