using A.Models;
using IdentityServer4.EntityFramework.Options;
//using Microsoft.AspNet.Identity.EntityFramework;
using Microsoft.AspNetCore.ApiAuthorization.IdentityServer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A.Data
{
    using Utility;
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
      
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions
            ) : base(options, operationalStoreOptions) {}

        public DbSet<Guide> Guide { get; set; }
        public DbSet<ApplicationUser> ApplicationUser{get;set;}

        public void AddUser(UserManager<ApplicationUser> userManager, 
            RoleManager<IdentityRole> roleManager, 
            UserDTO user,
            bool alertExists)
        {
            var role = roleManager.FindByNameAsync(user.Role).Result;
            if (role == null)
            {
                role = new IdentityRole
                {
                    Name = user.Role
                };
                roleManager.CreateAsync(role).Wait();
            }

            if (userManager.FindByNameAsync(user.UserName).Result == null)
            {
                var appUser = user.ToEntity();
                appUser.UserID = new UserID();
               
                IdentityResult result = userManager.CreateAsync (appUser, user.Password).Result;
                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(appUser, appUser.Role).Wait();
                    user.id = appUser.UserIDid;
                }
                else
                {
                    throw new Exception( result.Errors.Select(x => x.Description).Merge());
                }
            }
            else
            {
                if (alertExists)
                {
                    throw new Exception("the user exits already");
                }
            }
        }
        public void Seed(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            AddUser(userManager, roleManager, new UserDTO
            {
                Role = Models.ApplicationUser.ADMIN_ROLE, 
                UserName = "admin@a.com",
                FirstName = "a",
                LastName = "admin",
                Password = "Abcd1234!"
                
            }, false);
        }
    }
}
