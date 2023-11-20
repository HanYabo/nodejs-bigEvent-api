// 导入验证规则模块
const joi = require('joi')

// 定义 分类名称 和 分类别名 的校验规则
const name = joi.string().required()
const alias = joi.string().alphanum().required()

// 添加分类的校验规则对象
exports.add_cate_schema = {
    body: {
        name,
        alias
    }
}

// 定义 分类id 的校验规则
const id = joi.number().integer().min(1).required()

// 删除分类的验证规则对象
exports.delete_cate_schema = {
    params: {
        id
    }
} 

// 更新分类的验证规则对象
exports.update_cate_schema = {
    body: {
        id,
        name,
        alias,
    }
}