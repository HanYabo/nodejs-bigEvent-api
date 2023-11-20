const mysql = require('mysql')
const util = require('util')

// 创建连接对象
const db = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'infinity@Han',
    database: 'test'
})

queryByPromisify = util.promisify(db.query).bind(db)

db.queryByPromisify = queryByPromisify

// 向外暴露
module.exports = db