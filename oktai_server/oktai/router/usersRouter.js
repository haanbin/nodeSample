const users = require('../controllers/users');

exports.setRequestUrl = (app)=>{
  app.route('/users')
     .get()
     .delete();
  app.route('/users/likes')
     .get(users.userLikesList);
};


/*
유저 등록, 삭제(userToken, pushToken)
GET  /users
DELETE /users

유저 좋아요 리스트(셋팅창에서 좋아요 목록 클릭시)
GET /users/likes

유저 설정창(푸시 on/off) : 유저의 푸시상태 가져오기
GET /users/push

유저 푸시변경 상태
POST /users/push
*/
