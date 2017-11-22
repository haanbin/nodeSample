const connHelper = require('../utils/mysqlConnectionHelper');
const storesDb = require('../model/storesDb');
require('date-utils');

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 상점 리스트 출력
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
let data;

exports.listStores = async function(req,res,next) {
  try {
    let skip, count, type, latitude, longtitude, categoryId;
    let newDate = new Date();
    let time = newDate.toFormat('HH24');
    if (parseInt(req.query.skip)) {
       skip = parseInt(req.query.skip);
    }else {
      skip = 0;
    }
    if (parseInt(req.query.count)) {
      count = parseInt(req.query.count);
    }else {
      count = 5;
    }
    if (parseInt(req.query.type)) {
      type = parseInt(req.query.type);
    }else {
      type = 1;
    }

    if (type == 1) {
      data = await connHelper.conn2('select s.id, s.name, s.imagePath, s.detailLocation, s.programNormalPrice, s.programDiscountPrice from stores s limit ?, ?',[skip, count]);
    }

    if (type == 2) {
      data = await connHelper.conn2('SELECT s.id, s.name, s.thunbnailImage, s.simpleLocation\
      ,if((?)>=s.startDiscountTime and (?)<=s.endDiscountTime, 1, 0) as nowDiscount,\
       s.coupleDiscount, s.parking, s.sleeping, s.shower,\
        (select count(*) from users_likes_stores where users_likes_stores.storeId = s.id) as likeCount,\
         s.programNormalPrice, s.programDiscountPrice FROM stores s limit ?, ?', [time, time, skip, count]);
    }

    if (type == 3) {
      if (req.query.latitude && req.query.longtitude) {
        latitude = req.query.latitude;
        longtitude = req.query.longtitude;
        data = await connHelper.conn2('SELECT s.id, s.name, s.thunbnailImage, s.simpleLocation, if(?>=s.startDiscountTime and ?<=s.endDiscountTime, 1, 0) as nowDiscount, s.coupleDiscount, s.parking, s.sleeping, s.shower, round((6371*acos(cos(radians(?))*cos(radians(s.latitude))*cos(radians(s.longitude)-radians(?))+sin(radians(?))*sin(radians(s.latitude)))), 1)AS distance, (select count(*) from users_likes_stores where users_likes_stores.storeId = s.id) as likeCount, s.programNormalPrice, s.programDiscountPrice FROM stores s order by distance asc limit ?, ?', [time, time, latitude, longtitude, latitude, skip, count])
      }else {
        res.json({
          "message": "latitude or longitude is null"
        })
      }
    }
    res.status(200)
       .json({
         "message": "success",
         "skip": skip+count,
         "count": count,
         "data": data
       });

  }catch(e) {
    res.json({
        "message": "fail",
        "error": e.message
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 상점 하나 출력
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.oneStore = async function(req, res ,next) {
  try {
    let storeId = req.params.id;
    let newDate = new Date();
    let time = newDate.toFormat('HH24');
    // data = await connHelper.conn(storesDb.oneStoredQuery);
    // data = await connHelper.conn2('SELECT * FROM oktai.stores where (id = ?)', [parseInt(req.params.id)]);
    data = await connHelper.conn2('SELECT s.id, s.name, s.phoneNumber, s.workTime, if((?)>=s.startDiscountTime and (?)<=s.endDiscountTime, 1, 0)\
                                    as nowDiscount, s.coupleDiscount, s.parking, s.sleeping, s.shower FROM stores s where (id = ?)'
                                    ,[time, time, parseInt(req.params.id)]);
    let programs = await connHelper.conn2('select p.title, p.description, p.normalPrice, p.discountPrice, p.discountPercent from stores_has_programes shp\
                                            left join programes p on shp.programId = p.id where (shp.storeId = ?)', [parseInt(req.params.id)]);
    let imagePaths2 = await connHelper.conn2('SELECT si.imagePath FROM storeImage si where (storeId = ?);', [parseInt(req.params.id)]);
    let imagePaths = await connHelper.conn2('SELECT group_concat(si.imagePath separator ";") as imagePaths FROM storeImage si where (storeId = ?);', [parseInt(req.params.id)]);
    if (data[0]==undefined) {
      res.json({
        message: "error",
        data: "NOT FIND STOREID"
      });
    }else {
      data[0].programs = programs;
      data[0].imagePaths = imagePaths[0].imagePaths.split(';');
      res.status(200)
         .json({
           message: "success",
           data: data[0]
         });
    }

  } catch (e) {
    res.json({
        message: "error",
        data: e.message
    });
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 상점 좋아요 등록
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.likeStore= async function (req, res, next){
  try {
    let userToken= req.headers.token;
    if (userToken == null) {
      res.json({
        message: "error",
        data: "token is null"
      });
    }else {
      let userId = await connHelper.conn2('select u.id from users  u where (userToken = ?)', [userToken]);
      let storeId = req.params.id;
      if (userId) {
        data = await connHelper.conn2('insert into users_likes_stores (userId, storeId) value ((?), (?));', [parseInt(userId[0].id), storeId]);
        res.status(200)
           .json({
             message: "success",
             data: data[0]
           });
      }
    }
  } catch (e) {
      res.json({
        message: "error",
        data: e.message
      });
  }
}

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 상점 좋아요 삭제
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

exports.deleteStore= async function(req, res, next) {
  try {
    let userToken= req.headers.token;
    if (userToken == null) {
      res.json({
        message: "error",
        data: "token is null"
      });
    }else {
      let userId = await connHelper.conn2('select u.id from users  u where (userToken = ?)', [userToken]);
      let storeId = req.params.id;
      if (userId) {
        data = await connHelper.conn2('delete from users_likes_stores where (userId = ?) and (storeId = ?)', [parseInt(userId[0].id), storeId]);
        res.status(200)
           .json({
             message: "success",
             data: data[0]
           });
      }
    }
  } catch (e) {
      res.json({
        message: "error",
        data: e.message
      });
  }
}
