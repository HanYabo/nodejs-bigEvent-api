const express = require('express')
const bodyParser = require( 'body-parser')
const app = express()

const joi = require('joi')

const userRouter = require('./router/user')
const userinfoRouter = require('./router/userinfo')
const artcateRouter = require('./router/artcate')
const articleRouter = require('./router/article')

// 导入配置文件
const config = require('./config')

// 解析Token的中间件
const expressJwt = require('express-jwt')

// 配置跨域访问
const cors = require('cors')

app.use(cors())

// 指定哪些接口不需要进行Token身份验证（uploads和api不需要使用token）
app.use(expressJwt({secret: config.jwtSecretKey}).unless({path: [/^\/api\//,/^\/uploads\//]}))

// 托管静态资源文件
app.use('/uploads', express.static('./uploads'))

// 解析post表单数据
app.use(bodyParser.json({ limit: '50mb',extended: false }))
app.use(bodyParser.urlencoded({ limit: '50mb', extended: false }))

app.use('/api', userRouter)
app.use('/self', userinfoRouter)
app.use('/self/artcate', artcateRouter)
app.use('/self/article', articleRouter)

// 定义错误级别的中间件
app.use((err, req, res, next) => {
    console.log(err)
    // 验证失败导致的错误
    if(err instanceof joi.ValidationError) return res.send(err)
    // 身份认证失败错误
    if(err.name === 'UnauthorizedError') {
        return res.status(401).send({
            message: '身份认证失败！'
        })
    }
    // 未知错误
})


app.listen(8080,  () => {
    console.log('api server running at http://127.0.0.1:8080')
})