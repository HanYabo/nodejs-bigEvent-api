const db = require('../db/index')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const config = require('../config')

// 注册用户处理函数
exports.regUser = (req, res) => {
    // 接收表单数据
    const userinfo = req.body
    // 判断数据是否合法
    if (!userinfo.username || !userinfo.password) {
        return res.send({ status: 1, message: '用户名或密码不能为空！' })
    }

    const querySql = `select * from ev_users where username = ?`
    db.query(querySql, [userinfo.username], (err, result) => {
        if (err) {
            return res.send({ status: 1, message: err.message })
        }
        if (result.length !== 0) {
            return res.send({ status: 1, message: '用户名已存在！' })
        }
        // 用户名可用，继续后续流程
        // 调用 bcrypt.hashSync() 对密码进行加密
        userinfo.password = bcrypt.hashSync(userinfo.password, 10)
        // 插入新用户
        const insertSql = 'insert into ev_users set ?'
        db.query(insertSql, userinfo, (err, result) => {
            // 判断 SQL 语句是否执行成功
            if (err) return res.send({ status: 1, message: err.message })
            // 判断影响行数是否为1
            if (result.affectedRows !== 1) return res.send({ status: 1, message: '注册失败！' })
            // 注册用户成功
            res.send({ status: 0, message: '注册成功' })
        })
    })
}

// 登录用户处理函数
exports.login = (req, res) => {
    const userinfo = req.body
    // 查找用户
    const sql = 'select * from ev_users where username = ?'
    // 执行SQL
    db.query(sql, [userinfo.username], function(err, result) {
        if(err) return res.send({ status: 1, message: err.message })
        if(result.length === 0) return res.send({ status: 1, message: '用户名不存在！' })
        // 判断用户输入的登录的用户密码是否和数据库中的一致
        if(!bcrypt.compareSync(userinfo.password, result[0].password)) {
            return res.send({ status: 1, message: '密码错误！' })
        }

        // 登录成功，生成Token字符串
        // 将用户数据中的密码和头像剔除掉
        const user = {...result[0], password: '', user_pic: ''}
        // 生成Token字符串
        const tokenStr = jwt.sign(user, config.jwtSecretKey, {
            expiresIn: config.expiresIn // 有效期为10小时
        })

        // 将生成的Token字符串响应给服务器
        res.send({
            status: 0,
            message: '登录成功！',
            token: 'Bearer ' + tokenStr
        })

    })

    
}