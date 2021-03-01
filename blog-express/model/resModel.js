class BaseModel {
  constructor(data, message) {
    // 需要传入对象data 字符串message 如果只传入了字符串 那就赋值给data
    if( typeof data === 'string') {
      this.message = data
      data = null
      message = null
    }
    if (data) {
      this.data = data
    }
    if (message) {
      this.message = message
    }
  }
}
class SuccessModel extends BaseModel {
  constructor(data,message) {
    super(data,message)
    this.errno = 0
  }
}

class ErrorModel  extends BaseModel {
  constructor(data,message) {
    super(data,message)
    this.errno = -1
  }
}
module.exports = {
  SuccessModel,
  ErrorModel
}