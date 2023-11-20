const db = require('../db/index')

// 获取文章分类的处理函数
exports.getArticleCates = (req, res) => {
    // 定义SQL语句
    const sql = 'select * from ev_article_cate where is_delete = 0 order by id asc'
    // 执行SQL语句
    db.query(sql, (err, result) => {
        // 执行失败
        if (err) return res.send(err.message)
        // 执行成功
        res.send({
            status: 0,
            message: '获取文章分类列表成功！',
            data: result
        })
    })
}

// 新增文章分类的处理函数
exports.addArticleCate = (req, res) => {
    // 查询分类名称是否与分类别名相同
    // 定义查询 分类名称 与 分类别名 是否被占用的SQL语句
    const sql = 'select * from ev_article_cate where name = ? or alias = ?'

    // 执行查重操作
    db.query(sql, [req.body.name, req.body.alias], (err, result) => {
        // 执行SQL语句
        if (err) return res.send(err.message)
        // 判断分类名称和分类别名是否被占用
        if (result.length === 2) return res.send({ status: 1, message: '分类名称与别名被占用，请更换后重试！' })
        // 分别判断 分类名称 和 分类别名 是否被占用
        if (result.length === 1 && result[0].name === req.body.name) return res.send({ status: 1, message: '分类名称被占用，请更换后重试！' })
        if (result.length === 1 && result[0].alias === req.body.alias) return res.send({ status: 1, message: '分类别名被占用，请更换后重试！'})
        // 新增文章分类
        const sql = 'insert into ev_article_cate set ?'
        db.query(sql, req.body, (err, result) => {
            // 执行失败
            if(err) return res.send(err.message)
            // 执行成功 影响行数不为1
            if(result.affectedRows !== 1) return res.send({status: 1, message: '新增文章分类失败！'})
            // 新增文章分类成功
            res.send({ status: 0, message: '新增文章分类成功！' })
        })
    })
}

// 删除文章分类的处理函数
exports.deleteCateById = (req, res) => {
    const sql = 'update ev_article_cate set is_delete = 1 where id = ?'
    db.query(sql, req.params.id, (err, result) => {
        // 执行失败
        if(err) return res.send(err.message)

        // 执行成功，但影响条数不等于1
        if(result.affectedRows !== 1) return res.send({ status: 1, message: '删除文章分类失败！'})

        // 删除文章分类成功
        res.send({
            status: 0,
            message: '删除文章分类成功！'
        })
    })
}

// 更新文章分类的处理函数
exports.updateCateById = (req, res) => {
    // 定义查询 分类名称 与 分类别名 是否被占用的 SQL 语句
    const sql = 'select * from ev_article_cate where id <> ? and (name = ? or alias = ?)'

    db.query(sql, [req.body.id, req.body.name, req.body.alias], (err, result) => {
        // 执行失败
        if(err) return res.send(err.message)

        // 判断 分类名称 和 分类别名 是否被占用
        if(result.length === 2) return res.send({ status: 1, message: '分类名称与别名被占用，请更换后重试！' })
        if(result.length === 1 && result[0].name === req.body.name) return res.send({ status: 1, message: '分类名称被占用，请更换后重试！' })
        if(result.length === 1 && result[0].alias === req.body.alias) return res.send({ status: 1, message: '分类别名被占用，请更换后重试！'})

        // 更新文章分类
        const sql = 'update ev_article_cate set ? where id = ?'
        db.query(sql, [req.body, req.body.id], (err, result) => {
            // 执行失败
            if(err) return res.send(err.message)

            // 执行成功，但影响条数不等于1
            if(result.affectedRows !== 1) return res.send({ status: 1, message: '更新文章分类失败！'})

            // 更新文章分类成功
            res.send({
                status: 0,
                message: '更新文章分类成功！'
            })
        })
    })
}

