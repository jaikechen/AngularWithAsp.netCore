using IdentityModel;
using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace A.Models
{
    public class UserID
    {
        public int id { get; set; }
    }
    public class ApplicationUser : IdentityUser
    {
        public const string ADMIN_ROLE = "admin";
        public const string USER_ROLE = "user";
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public int UserIDid { get; set; }
        public UserID UserID { get; set; }
        public string Role { get; set; }
    }

    public class UserDTO
    {
        public int id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string UserName { get; set; }
        public string PhoneNumber { get; set; }
        public string Role { get; set; }
        public string Password { get; set; }
        public UserDTO() { }
        public UserDTO(ApplicationUser usr)
        {
            id = usr.UserIDid;
            FirstName = usr.FirstName;
            LastName = usr.LastName;
            PhoneNumber = usr.PhoneNumber;
            UserName = usr.UserName;
            Role = usr.Role;
        }
       public ApplicationUser ToEntity()
       {
            return new ApplicationUser
            {
                UserName = UserName,
                FirstName = FirstName,
                LastName = LastName,
                PhoneNumber = PhoneNumber,
                Role = Role,
                Email =UserName, 
                EmailConfirmed = true
            };
        }
    }
}
