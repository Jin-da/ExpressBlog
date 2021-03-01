const env = process.env.NODE_ENV//环境参数

// 配置
let MYSQL_CONF
let REDIS_CONF

if (env === 'dev') {//线下
  // mysql
  MYSQL_CONF = {
    host: 'localhost',//域
    user: 'root',
    password: '123',
    port: '3306',
    database: 'myblog'//数据库
  }
  // redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

if (env == 'production') {//线上
  // mysql
  MYSQL_CONF = {
    host: 'localhost',//域
    user: 'root',
    password: '123',
    port: '3306',
    database: 'myblog'//数据库
  }
  // redis
  REDIS_CONF = {
    port: 6379,
    host: '127.0.0.1'
  }
}

module.exports = {
  MYSQL_CONF,
  REDIS_CONF
}