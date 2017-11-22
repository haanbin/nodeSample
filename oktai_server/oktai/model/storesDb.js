var listStoresQuery = 'select * from stores';
var oneStoredQuery = 'SELECT * FROM oktai.stores where id = $1, parseInt(req.params.id)';
module.exports ={
  listStoresQuery : listStoresQuery,
  oneStoredQuery : oneStoredQuery
};
