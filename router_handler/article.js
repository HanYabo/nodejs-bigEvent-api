// 导入数据库操作模块
const db = require('../db/index')

// 导入处理路径的 path 核心模块
const path = require('path')

// 发布新文章的处理函数
exports.addArticle = (req, res) => {
    // 手动判断是否上传了文章封面
    if (!req.file || req.file.fieldname !== 'cover_img') return res.send({ status: 1, message: '文章封面是必选参数！' })

    const articleInfo = {
        // 标题、内容、状态、所属的分类id
        ...req.body,
        // 文章封面在服务器端的存放路径
        cover_img: path.join('../uploads', req.file.filename),
        // 文章发布时间
        pub_date: new Date(),
        // 文章删除状况（默认为0）
        is_delete: 0,
        // 文章作者的Id
        author_id: req.user.id,
    }
    const sql = `insert into ev_articles set ?`

    // 执行 SQL 语句
    db.query(sql, articleInfo, (err, result) => {
        // 执行 SQL 语句失败
        if (err) return res.send(err.message)

        // 执行 SQL 语句成功，但是影响行数不等于 1
        if (result.affectedRows !== 1) return res.send({ status: 1, message: '发布文章失败！' })

        // 发布文章成功
        res.send({ status: 0, message: '发布文章成功！' })
    })

}

// 获取文章列表的处理函数
exports.getArticleList = async (req, res) => {
    const sql = `select a.id, a.title, a.pub_date, a.state, b.name as cate_name
                    from ev_articles as a,ev_article_cate as b 
                    where a.cate_id = b.id and a.cate_id = ifnull(?, a.cate_id) and a.state = ifnull(?, a.state) and a.is_delete = 0 limit ?, ?`

    let results = []
    try {
        results = await db.queryByPromisify(sql, [req.query.cate_id || null, req.query.state || null, (req.query.pagenum - 1) * req.query.pagesize, req.query.pagesize])
    } catch (e) {
        return res.send(e.message)
    }

    const countSql = 'select count(*) as num from ev_articles where is_delete = 0 and state = ifnull(?, state) and cate_id = ifnull(?,cate_id)'
    let total = null
    try {
        let [{ num }] = await db.queryByPromisify(countSql, [req.query.state || null, req.query.cate_id || null])
        total = num
    } catch {
        return res.send(e.message)
    }
    res.send({
        status: 0,
        message: '获取文章列表成功！',
        data: results,
        total
    })
}

// 根据id获取文章详情
exports.getArticleInfo = (req, res) => {
    const sql = `select * from ev_articles where id =?`
    db.query(sql, [req.query.id], (err, result) => {
        if (err) return res.send(err.message)
        if (result.length === 0) {
            res.send({
                status: 1,
                message: '获取文章详情失败！'
            })
        }
        res.send({
            status: 0,
            message: '获取文章详情成功！',
            data: result[0]
        })

    })
}

// 根据id删除文章
exports.deleteArticle = (req, res) => {
    const sql = `delete from ev_articles where id = ?`

    db.query(sql, req.query.id, (err, result) => {
        if (err) return res.send(err.message)
        // 影响条数不为一
        if(result.affectedRows !== 1) return res.send({ status: 1, message: '删除文章失败！' })
        res.send({
            status: 0,
            message: '删除文章成功！'
        })
    })
}
