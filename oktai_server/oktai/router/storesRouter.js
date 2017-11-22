const stores = require('../controllers/stores');

exports.setRequestUrl = (app) =>{
  app.route('/stores')
     .get(stores.listStores);
  app.route('/stores/:id')
     .get(stores.oneStore);
  app.route('/stores/:id/like')
     .get(stores.likeStore)
     .delete(stores.deleteStore);
};





/*
상점 리스트 보기(쿼리 :  인기순, 거리순, 카테고리, 사용자위치, 페이징)
GET /stores?skip=0&count=5&orderBy=1 (인기순) 홈
GET /stores?skip=0&count=5&latitude=38.22342123&longitude=18.42334123
 (latitude:위도 longitude:경도)
GET /stores?skip=0&count=5&categoryId=1 (동으로 검색)

상점 리스트 자세히 보기
GET /stores/{id}

상점 좋아요
GET /stores/:id/like
DELETE /stores/:id/like

*/
