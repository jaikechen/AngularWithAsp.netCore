using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using System.Text;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Http.Extensions;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Configuration;
using Microsoft.EntityFrameworkCore.Internal;

namespace A.Services
{
    public class MyClaimsTransformer :IClaimsTransformation 
    {

        public MyClaimsTransformer() { }

        public async Task<ClaimsPrincipal> TransformAsync(ClaimsPrincipal user)
        {
            var role = user.Claims.FirstOrDefault(x => x.Type.Contains("role"))?.Value??string.Empty;

            var identity = new ClaimsIdentity();
            identity.AddClaim(new Claim(ClaimTypes.Role, role));
            user.AddIdentity(identity);
            return user;
        }
    }
}
