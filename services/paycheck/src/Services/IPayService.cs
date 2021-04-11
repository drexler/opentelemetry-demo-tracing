using System.Collections.Generic;
using System.Threading.Tasks;
namespace app.Services
{
    public interface IPayService
    {
        Task<IEnumerable<Paycheck>> GetAllPaychecksAsync();
        Task<Paycheck> GetPaycheckAsync(string paycheckId);
        Task<IEnumerable<Paycheck>> GetEmployeePaychecksAsync(string employeeId);

    }
}