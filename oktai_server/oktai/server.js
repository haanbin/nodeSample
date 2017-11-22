const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const morgan = require('morgan');
const usersRouter = require('./router/usersRouter');
const storesRouter = require('./router/storesRouter');
const adminRouter = require('./router/adminRouter');

app.use(morgan('dev'));
app.set('views', './views');
app.set('view engine', 'pug');
app.use(bodyParser.urlencoded({ extended : false }));

usersRouter.setRequestUrl(app);
storesRouter.setRequestUrl(app);
adminRouter.setRequestUrl(app);

app.listen(3000, () => {
  console.log('Connected 3000 port');
});
