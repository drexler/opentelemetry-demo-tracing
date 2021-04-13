using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Threading.Tasks;

using MongoDB.Driver;

using app.Entities;

namespace app.Repositories
{
    public class PayRepository : BaseRepository<Pay>, IPayRepository
    {
        private readonly ActivitySource _activitySource;
        public PayRepository(
            IMongoClient mongoClient,
            IClientSessionHandle clientSessionHandle) : base(mongoClient, clientSessionHandle, "paychecks")
        {
            _activitySource = new ActivitySource("paycheck-db-conn");
        }

        public async Task<IEnumerable<Pay>> GetAllPaychecksAsync()
        {
            var span = _activitySource.StartActivity("GetAllPaychecksAsync");
            List<Pay> result = null;
            try
            {
                result = await Collection.AsQueryable().ToListAsync();
                span.AddTag("paychecks.count", result.Count);
            }
            catch (Exception ex)
            {
                span.AddEvent(new ActivityEvent($"Call Failure. Reason: {ex.Message}"));
                throw;
            }
            finally
            {
                span.Stop();
            }

            return result;
        }

        public async Task<Pay> GetPaycheckAsync(string paycheckId)
        {
            var span = _activitySource.StartActivity("GetPaycheckAsync");
            Pay result = null;
            try
            {
                var filter = Builders<Pay>.Filter.Eq(p => p.Id, paycheckId);
                result = await Collection.Find(filter).FirstOrDefaultAsync();
            }
            catch (Exception ex)
            {
                span.AddEvent(new ActivityEvent($"Call Failure. Reason: {ex.Message}"));
                throw;
            }
            finally
            {
                span.Stop();
            }

            return result;
        }

        public async Task<IEnumerable<Pay>> GetEmployeePaychecksAsync(string employeeId)
        {
            var span = _activitySource.StartActivity("GetEmployeePaychecksAsync");
            List<Pay> result = null;
            try
            {
                var filter = Builders<Pay>.Filter.Eq(p => p.EmployeeId, employeeId);
                result = await Collection.Find(filter).ToListAsync();
            }
            catch (Exception ex)
            {
                span.AddEvent(new ActivityEvent($"Call Failure. Reason: {ex.Message}"));
                throw;
            }
            finally
            {
                span.Stop();
            }

            return result;
        }

    }
}