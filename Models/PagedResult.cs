using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace A.Models
{
    public class PagedResult<T>  where T : class
    {
        public List<T> items { get; set; } = new List<T>();
        public int totalCount { get; set; }
    }
    public static class PageResultExtension
    {
        public static PagedResult<T> ToPaged<T>(this IQueryable<T> query, int page, int pageSize , string sortField, string sortOrder) where T : class
        {
            if(sortOrder == "asc")
            {
                query = query.OrderByDynamic(x=>$"x.{sortField}");
            }
            else
            {
                query = query.OrderByDescendingDynamic(x=>$"x.{sortField}");
            }

            var result = new PagedResult<T>();
            result.totalCount = query.Count();
            var skip = page * pageSize;
            if (pageSize > 0)
            {
                result.items = query.Skip(skip).Take(pageSize).ToList();
            }
            else
            {
                result.items = query.ToList();
            }
            return result;
        }
    }
}
