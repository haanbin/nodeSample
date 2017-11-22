const mysql = require('promise-mysql');
const config = require('config');

pool = mysql.createPool(config.Customer.dbConfig);

function getSqlConnection(){
  return pool.getConnection().disposer((connection) => {
    pool.releaseConnection(connection);
  });
}

module.exports = getSqlConnection;
