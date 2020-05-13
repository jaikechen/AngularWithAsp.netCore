using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace A.Models
{
    public class Guide
    {
        public int id { get; set; }
        public string firstName { get; set; }
        public string lastName { get; set; }
        public string status { get; set; }
    }
}
