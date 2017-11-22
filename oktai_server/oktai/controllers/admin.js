const connHelper = require('../utils/mysqlConnectionHelper');


exports.login = async function(req, res, next) {
  try {
    var output = `
    <form action = "/admin/login" method="post">
      <h1>Admin Login</h1>
        <p>
          <input type="text" name="username" placeholder="username">
        </p>
        <p>
          <input type="password" name="password" placeholder="password">
        </p>
        <p>
          <input type="submit">
        </P>

    </form>
    `;

    res.send(output);
  } catch (e) {
    res.send(e.mesaage)
  }

}

exports.loginCheck = async function (req, res, next) {
  try {
    var user = {
      username : 'admin',
      password : 'oktai'
    };

    var uname = req.body.username;
    var pwd = req.body.password;
    if (uname === user.username && pwd === user.password) {
        res.send('success');
    }else {
      res.send('fail <a href="/auth/login">login</a>');
    }
  } catch (e) {
    res.json(e.message);
  }


}
