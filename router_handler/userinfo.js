const db = require('../db/index')
const bcrypt = require('bcryptjs')

// 获取用户基本信息的处理函数
exports.getUserInfo = (req, res) => {

    // 根据用户id进行查询
    // 注意：为了防止用户密码的泄露，需要排除password字段
    const sql = 'select id, username, nickname, email, user_pic from ev_users where id = ?'
    // 注意：req对象上的user属性，是从Token解析成功，express-jwt中间件添加的属性
    db.query(sql, [req.user.id], (err, result) => {
        if (err) return res.send(err.message)

        // 查询结果不唯一
        if (result.length !== 1) return res.send('获取用户信息失败！')

        // 将用户信息相应到客户端
        res.send({
            status: 0,
            message: '获取用户基本信息成功！',
            data: result[0]
        })
    })
}

// 更新用户基本信息的处理函数
exports.updateUserInfo = (req, res) => {
    const sql = `update ev_users set ? where id = ?`

    db.query(sql, [req.body, req.body.id], (err, result) => {
        // 执行失败
        if (err) return res.send(err.message)
        // 执行成功，但影响条数不为1
        if (result.affectedRows !== 1) return res.send('更新用户基本信息失败！')

        // 更新用户信息成功
        return res.send({
            status: 0,
            message: '更新用户基本信息成功！'
        })
    })
}

// 重置密码的处理函数
exports.resetPassword = (req, res) => {
    // 根据id查询是否存在用户
    const querySql = 'select * from ev_users where id = ?'

    db.query(querySql, req.user.id, (err, result) => {
        // 执行失败
        if (err) return res.send(err.message)
        // 没有查询到
        if (result.length === 0) return res.send({
            status: 1,
            message: '用户不存在！'
        })
        // 比较旧密码是否正确
        const compareResult = bcrypt.compareSync(req.body.oldPwd, result[0].password)
        if (!compareResult) return res.send({
            status: 1,
            message: '原密码错误！'
        })
        // 更新密码
        const updateSql = 'update ev_users set password = ? where id = ?'

        // 对新密码进行加密处理
        const newPwd = bcrypt.hashSync(req.body.newPwd, 10)

        // 将新密码写入数据库
        db.query(updateSql, [newPwd, req.user.id], (err, result) => {
            // 执行失败
            if (err) return res.send(err.message)
            // 执行成功，但影响条数不为1
            if (result.affectedRows !== 1) return res.send('重置密码失败！')

            // 重置密码成功
            return res.send({
                status: 0,
                message: '重置密码成功！'
            })
        })
    })
}

// 更新用户头像的处理函数
exports.updateAvatar = (req, res) => {
    const sql = 'update ev_users set user_pic = ? where id = ?'
    // 执行SQL语句
    db.query(sql, [req.body.avatar, req.user.id], (err, result) => {
        // 执行失败
        if(err) return res.send(err.message)
        // 影响的行数是否为1
        if(result.affectedRows !== 1) return res.send('更新头像失败！')
        // 成功
        res.send({
            status: 0,
            message: '更新头像成功！'
        })
    })
}