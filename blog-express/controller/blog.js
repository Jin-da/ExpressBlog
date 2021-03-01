const xss = require('xss')
const {exec} = require('../db/mysql')
// 获取博客列表
const getList = (author, keyword) => {
  let sql = `select * from blogs where 1=1 `//为了防止没有author keyword出错
  if(author) {
    sql += `and author = '${author}'`
  }
  if(keyword) {
    sql += `and title like '%${keyword}%'`
  }
  sql += `order by createtime desc;`
  // 返回的是promise
  return exec(sql)
}

// 获取博客详情
const getDetail = (id) => {
  const sql =  `select * from blogs where id = '${id}';`
  return exec(sql).then(rows => {//只会查到一个内容 但他仍是数组 于是需要把它变成对象
    return rows[0]
  })
}

//新建博客
const newBlog = (blogData = {}) => {
  // blogData是一个博客对象，包含title,content,author
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const author = blogData.author
  const createtime = Date.now()
  const sql = `insert into blogs (title,content,createtime,author) values ('${title}','${content}','${createtime}','${author}');`
  return exec(sql).then(insertData => {
    return {
      id: insertData.insertId
    }
  })
}

// 更新博客
const updateBlog = (id, blogData = {}) => {
  //id是要更新的博客的id
  // blogData是一个博客对象，包含title和content
  const title = xss(blogData.title)
  const content = xss(blogData.content)
  const sql = `update blogs set title='${title}',content='${content}' where id=${id};`
  return exec(sql).then(updateData => {
    if (updateData.affectedRows > 0) {
      return true
    }
    return false
  })
}

// 删除博客
const delBlog = (id, author) => {
  // id就是要删除的id
  const sql = `delete from blogs where id='${id}' and author='${author}';`
  return exec(sql).then(delData => {
    if (delData.affectedRows > 0) {
      return true
    }
    return false
  })
}

module.exports = {
  getList,
  getDetail,
  newBlog,
  updateBlog,
  delBlog
}