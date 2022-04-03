// const client = redis.createClient({
//   host: keys.REDIS_URL,
//   port: keys.REDIS_PORT,
//   retry_strategy: () => 1000
// });
// client.hget = utils.promisify(client.hget);

// const exec = mongoose.Query.prototype.exec;

// mongoose.Query.prototype.cache = async function(options = {}) {
//   this.useCache = true;
//   this.hashKey = JSON.stringify(options.key || '');

//   return this;
// };

// mongoose.Query.prototype.exec = async function() {
//   if(!this.useCache) {
//     return exec.apply(this, arguments);
//   }

//   const key = JSON.stringify(
//     Object.assign({}, this.getQuery(), {
//       collection: this.mongooseCollection.name
//     })
//   );

//   const cacheValue = await client.hget(this.hashKey, key);

//   if(cacheValue) {
//     const doc = JSON.parse(cacheValue);
//     console.log('FROM CACHE');
//     return Array.isArray(doc) ?
//       doc.map(d => new this.model(d))
//       : new this.model(doc);
//   }

//   const result = await exec.apply(this, arguments);

//   client.hset(this.hashKey, key, JSON.stringify(result));
//   return result;
// };

// module.exports = {
//   clearHash(hashKey) {
//     client.del(JSON.stringify(hashKey));
//   }
// };
