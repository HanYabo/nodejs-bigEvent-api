const joi = require('joi')

/**
 * string() 值必须是字符串
 * alphanum() 值只能是包含 a-zA-Z0-9 的字符串
 * min(length) 最小长度
 * max(length) 最大长度
 * required() 值是必选项，不能为 undefined
 * pattern(正则表达式) 值必须符合正则表达式的规则
 */

// 用户名的验证规则
const username = joi.string().alphanum().min(1).max(10).required()
// 密码的验证规则
const password = joi.string().pattern(/^[\S]{6,12}$/)

// 注册和登录表单的验证规则对象
exports.reg_login_schema = {
    // 表示需要对 req.body 中的数据进行验证
    body: {
        username,
        password
    }
}

// 定义id,nickname,email的验证规则
const id = joi.number().integer().min(1).required()
const nickname = joi.string().required()
const email = joi.string().email().required()

// 更新用户基本信息的验证规则对象
module.exports.update_userinfo_schema = {
    body: {
        id,
        nickname,
        email
    }
}

// 重置密码的验证规则对象
exports.reset_password_schema = {
    body: {
        // 使用password这个规则，验证 req.body.oldPwd 的值
        oldPwd: password,
        // 使用 joi.not(joi.ref('oldPwd')).concat(password) 规则，验证 req.body.newPwd 的值
        newPwd: joi.not(joi.ref('oldPwd')).concat(password)
    }
}

const avatar = joi.string().dataUri().required()

// 更新头像的验证规则对象
exports.update_avatar_schema = {
    body: {
        avatar
    }
}