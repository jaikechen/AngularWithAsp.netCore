using A.Models;
using IdentityServer4.EntityFramework.Options;
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
    public class ApplicationDbContext : ApiAuthorizationDbContext<ApplicationUser>
    {
        public ApplicationDbContext(
            DbContextOptions options,
            IOptions<OperationalStoreOptions> operationalStoreOptions) : base(options, operationalStoreOptions)
        {
        }

        public DbSet<Guide> Guide { get; set; }
        public void Seed(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            if (roleManager.FindByNameAsync("admin").Result == null)
            {
                roleManager.CreateAsync(new IdentityRole { 
                    Name="admin"
                }).Wait();
            }
            if (userManager.FindByNameAsync("admin@a.com").Result == null)
            {
                var user = new ApplicationUser();
                user.UserName = "admin@a.com";
                user.Email = "admin@a.com";
                user.EmailConfirmed = true;
                user.Firstname = "a";
                user.Lastname = "admin";

                IdentityResult result = userManager.CreateAsync (user, "Abcd1234!").Result;
                if (result.Succeeded)
                {
                    userManager.AddToRoleAsync(user, "admin").Wait();
                }
            }
        }
    }
}
