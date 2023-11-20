const express = require('express')

const router = express.Router()

// 导入验证数据合法性的中间件
const expressJoi = require('@escook/express-joi')

// 导入需要的验证规则对象
const { update_userinfo_schema, reset_password_schema, update_avatar_schema } = require('../schema/user')

// 导入用户信息的处理函数模块
const userinfoRouter = require('../router_handler/userinfo')

// 获取用户的基本信息
router.get('/userinfo', userinfoRouter.getUserInfo)

// 更新用户的基本信息
router.post('/userinfo', expressJoi(update_userinfo_schema), userinfoRouter.updateUserInfo)

// 重置密码
router.post('/resetpwd', expressJoi(reset_password_schema), userinfoRouter.resetPassword)

// 更新用户头像
router.post('/update/avatar', expressJoi(update_avatar_schema), userinfoRouter.updateAvatar)

// 向外共享路由对象
module.exports = router