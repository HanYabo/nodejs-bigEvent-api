const express = require('express')

const router = express.Router()

// 导入验证数据中间件
const expressJoi = require('@escook/express-joi')

// 导入文章分类的验证模块
const { add_cate_schema, delete_cate_schema, update_cate_schema } = require('../schema/artcate')

// 导入文章分类的路由处理函数模块
const artcateRouter = require('../router_handler/artcate')

// 获取文章分类的列表数据
router.get('/cates', artcateRouter.getArticleCates)

// 新增文章分类
router.post('/addcate', expressJoi(add_cate_schema), artcateRouter.addArticleCate)

// 删除文章分类
router.get('/deletecate/:id', expressJoi(delete_cate_schema), artcateRouter.deleteCateById)

// 更新文章分类
router.post('/updatecate', expressJoi(update_cate_schema), artcateRouter.updateCateById)

module.exports = router