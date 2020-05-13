using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A.Models
{
    public class ApplicationUser : IdentityUser
    {
        public const string ADMIN_ROLE = "admin";
        public string Firstname { get; set; }
        public string Lastname { get; set; }
    }
}
