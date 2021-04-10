using System.Collections.Generic;
using System.Threading.Tasks;

using app.Entities;


namespace app.Repositories
{
    public interface IRepositoryBase<T> where T : BaseEntity
    {
        Task InsertAsync(T obj);
        Task UpdateAsync(T obj);
        Task DeleteAsync(string id);
    }

    public interface IPayRepository : IRepositoryBase<Pay>
    {
        Task<IEnumerable<Pay>> GetAllPaychecksAsync();
        Task<Pay> GetPaycheckAsync(string paycheckId);
        Task<IEnumerable<Pay>> GetEmployeePaychecksAsync(string employeeId);
    }
}