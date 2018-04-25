module.exports = function(env) {
  return {
    dbURL: process.env.MONGODB_HOST || env[process.env.NODE_ENV].mongoURL,
    // dbURL: 'mongodb://'+process.env.MONGODB_HOST+':27017/'+process.env.MONGODB_DATABASE,
  }; // mongodb://127.0.0.1:27017/routes <- add more query server urls for scaling
};
