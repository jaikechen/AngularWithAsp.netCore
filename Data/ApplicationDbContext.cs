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
            UserDTO user,
            bool alertExists)
        {
            if (userManager.FindByNameAsync(user.UserName).Result == null)
            {
                var appUser = user.ToEntity();
                appUser.UserID = new UserID();
                IdentityResult result = userManager.CreateAsync (appUser, user.Password).Result;
                if (result.Succeeded)
                {
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

        public async void UpdateUser(UserManager<ApplicationUser> userManager, UserDTO userDTO)
        {
            var usr =await userManager.FindByNameAsync(userDTO.UserName);
            if(usr ==null)
            {
                throw new Exception("the user does not exist");
            }
            else
            {
                usr.PhoneNumber = userDTO.PhoneNumber;
                usr.FirstName = userDTO.FirstName;
                usr.LastName = userDTO.LastName;
                usr.Role = userDTO.Role;
            }
            var result = await userManager.UpdateAsync(usr);
            if(!result.Succeeded)
            {
                throw new Exception(result.Errors.Select(x => x.Description).Merge());
            }
        }
        public void Seed(UserManager<ApplicationUser> userManager)
        {
            AddUser(userManager, new UserDTO
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
