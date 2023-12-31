// 导入定义验证规则的模块
const joi = require('joi')

// 定义 标题、分类Id、内容、发布状态 的验证规则
const title = joi.string().required()
const cate_id = joi.number().integer().min(1).required()
const content = joi.string().required().allow('')
const state = joi.string().valid('已发布', '草稿').required()

// 验证规则对象 - 发布文章
exports.add_article_schema = {
  body: {
    title,
    cate_id,
    content,
    state,
  },
}

const pagenum = joi.number().integer().min(0).required()
const pagesize = joi.number().integer().min(1).required()
const cate_id_optional = joi.string().allow('').optional()
const state_optional = joi.string().allow('').optional()
// 验证规则对象 - 获取文章列表
exports.list_article_schema = {
  query: {
      pagenum,
      pagesize,
      cate_id: cate_id_optional,
      state: state_optional
  }
}

const id = joi.number().integer().min(1).required()
// 验证规则对象 - 删除文章
exports.delete_article_schema = {
  query: {
    id
  }
}
