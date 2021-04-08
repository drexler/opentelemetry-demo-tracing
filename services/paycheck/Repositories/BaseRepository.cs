using MongoDB.Driver;
using System;
using System.Linq.Expressions;
using System.Threading.Tasks;

using app.Entities;

// Credit: https://github.com/alexalvess
namespace app.Repositories
{
    public class BaseRepository<T> : IRepositoryBase<T> where T : BaseEntity
    {
        private const string DATABASE = "pay";
        private readonly IMongoClient _mongoClient;
        private readonly IClientSessionHandle _clientSessionHandle;
        private readonly string _collection;

        public BaseRepository(IMongoClient mongoClient, IClientSessionHandle clientSessionHandle, string collection)
        {
            (_mongoClient, _clientSessionHandle, _collection) = (mongoClient, clientSessionHandle, collection);

        }

        protected virtual IMongoCollection<T> Collection =>
            _mongoClient.GetDatabase(DATABASE).GetCollection<T>(_collection);

        public async Task InsertAsync(T obj) =>
            await Collection.InsertOneAsync(_clientSessionHandle, obj);

        public async Task UpdateAsync(T obj)
        {
            Expression<Func<T, string>> func = f => f.Id;
            var value = (string)obj.GetType().GetProperty(func.Body.ToString().Split(".")[1]).GetValue(obj, null);
            var filter = Builders<T>.Filter.Eq(func, value);

            if (obj != null)
                await Collection.ReplaceOneAsync(_clientSessionHandle, filter, obj);
        }

        public async Task DeleteAsync(string id) =>
            await Collection.DeleteOneAsync(_clientSessionHandle, f => f.Id == id);
    }
}