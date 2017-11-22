const admin = require('../controllers/admin');

exports.setRequestUrl = (app) =>{
  app.route('/admin/login')
     .get(admin.login)
     .post(admin.loginCheck);
};
