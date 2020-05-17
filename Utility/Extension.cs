using IdentityServer4.Events;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace A.Utility
{
    public static class Extension
    {
        public static string Merge(this IEnumerable<string> arr, string seperator ="\r\n")
        {
            var result = string.Empty;
            foreach(var str in arr)
            {
                if (!string.IsNullOrWhiteSpace(str))
                {
                    result += seperator;
                }
                result += str;
            }
            return result;
        }
    }
}
