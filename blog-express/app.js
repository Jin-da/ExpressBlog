var createError = require('http-errors');
var express = require('express');
var path = require('path');
var fs = require('fs')
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session')
const RedisStore = require('connect-redis')(session)

// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
const blogRouter = require('./routes/blog')
const userRouter = require('./routes/user')

var app = express();

//视图 与前端有关
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

const ENV = process.env.NODE_ENV
if (ENV !== 'production') {
  //开发环境
  app.use(logger('dev', {//dev为一种显示格式 有很多见github morgan
    stream: process.stdout//默认配置 在控制台输出日志
  }));
} else {
  //线上环境
  const logFileName = path.join(__dirname, 'logs', 'access.log')//写入的目标文件
  const writeStream = fs.createWriteStream(logFileName, {//写入流
    flags: 'a'
  }) 
  app.use(logger('combined', {
    stream: writeStream
  }));
}

app.use(express.json());//获取post数据（json）
app.use(express.urlencoded({ extended: false }));//获取post数据(其他格式)
app.use(cookieParser());//解析cookie
app.use(express.static(path.join(__dirname, 'public')));//前端


const redisClient = require('./db/redis')
const sessionStore = new RedisStore({
  client: redisClient
})
// 解析session
app.use(session({
  secret: 'WJosaf#asd',//密匙
  cookie: {
    //path: '/',//根目录 使所有路由生效 为默认配置
    //httpOnly: true,//只允许后端修改cookie 为默认配置
    maxAge: 24 * 60 * 60 * 1000//设置cookie过期时间
  },
  store: sessionStore//将session存储到redis
}))

//注册路由
app.use('/api/blog', blogRouter)
app.use('/api/user', userRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'dev' ? err : {};//处于开发环境时会将错误报出

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
