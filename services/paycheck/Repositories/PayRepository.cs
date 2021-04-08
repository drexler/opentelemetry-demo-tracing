using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

using app.Entities;

using MongoDB.Driver;

namespace app.Repositories
{
   public class PayRepository : BaseRepository<Pay>, IPayRepository
    {
        public PayRepository(
            IMongoClient mongoClient,
            IClientSessionHandle clientSessionHandle) : base(mongoClient, clientSessionHandle, "paycheck")
        {
        }

        public async Task<IEnumerable<Pay>> GetAllPaychecksAsync() =>
            await Collection.AsQueryable().ToListAsync();

        public async Task<Pay> GetPaycheckAsync(string paycheckId) 
        {
            var filter = Builders<Pay>.Filter.Eq(p => p.Id, paycheckId);
            return await Collection.Find(filter).FirstOrDefaultAsync();       
        }

        public async Task<IEnumerable<Pay>> GetEmployeePaychecksAsync(string employeeId) 
        {
           var filter = Builders<Pay>.Filter.Eq(p => p.EmployeeId, employeeId);
           return await Collection.Find(filter).ToListAsync();
        }
            
    }
}