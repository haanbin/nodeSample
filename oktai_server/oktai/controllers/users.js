const connHelper = require('../utils/mysqlConnectionHelper');
require('date-utils');


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 유저 상점 좋아요 리스트
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let data;

exports.userLikesList = async function(req, res, next) {
  try {
    let newDate = new Date();
    let time = newDate.toFormat('HH24');

    data = await connHelper.conn2('SELECT s.id, s.name, s.thunbnailImage, s.simpleLocation\
    ,if((?)>=s.startDiscountTime and (?)<=s.endDiscountTime, 1, 0) as nowDiscount,\
     s.coupleDiscount, s.parking, s.sleeping, s.shower,\
      (select count(*) from users_likes_stores where users_likes_stores.storeId = s.id) as likeCount,\
       s.programNormalPrice, s.programDiscountPrice FROM stores s', [time, time]);

    res.status(200)
       .json({
         message: 'success',
         data: data
       });



  } catch (e) {
    res.json({
        "message": "fail",
        "error": e.message
    });
  }

}
