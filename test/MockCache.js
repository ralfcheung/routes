class Cache {

  constructor(store, cb = null) {
    this.store = store;
    this.cb = cb;
  }

  get(key, cb) {
    if (this.store.hasOwnProperty(key)) {
      if (this.cb !== null) {
        return this.cb();
      }
      return cb(null, this.store[key]);
    }
    return cb(null, null);
  }

  set(key, info, duration, cb) {
    this.store[key] = info;
    if (this.cb !== null) {
      return this.cb(null);
    }
    cb(null);
  }
}

module.exports = Cache;
