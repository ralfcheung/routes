module.exports = function (env) {
  return {
    dbURL: env[process.env.NODE_ENV].mongoURL,
  } // mongodb://127.0.0.1:27017/routes <- add more query server urls for scaling
};
