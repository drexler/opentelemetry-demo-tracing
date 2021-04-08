using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Bson;

namespace app.Entities
{
    public abstract class BaseEntity
    {

        [BsonRepresentation(BsonType.ObjectId)]
        public virtual string Id { get; private set; }

        public void SetId(string id) =>
            Id = id;
    }
}