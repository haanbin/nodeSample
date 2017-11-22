const Promise = require("bluebird");
const getSqlConnection = require('./mysqlConnection');

exports.conn = function(query){

  return new Promise(function(resolve, reject) {
    Promise.using(getSqlConnection(), (connection) => {
     return connection.query(query).then((rows)=>{
       resolve(rows);
     }).catch((error) => {
       reject(error);
     });
    });
  })
};


exports.conn2 = function(query, params){

  return new Promise(function(resolve, reject) {
    Promise.using(getSqlConnection(), (connection) => {
     return connection.query(query, params).then((rows)=>{
console.log(query);
console.log(params);
       resolve(rows);

     }).catch((error) => {
       reject(error);
     });
    });
  })
};
