const express = require('express');

const app = express();

const cors = require('cors');
// 跨域处理
app.use(cors());

// 静态资源托管, 会自动去public目录下查找文件, 如果找到了就直接返回, 如果没有找到就会继续向下匹配路由
app.use(express.static('public'));

// 访问files目录下的文件，需要加上files前缀，前缀是可选的
app.use('/files', express.static('files'));

// 解析json格式的请求体
app.use(express.json());

// 解析URL编码的请求体, extended为true表示使用qs库来解析请求体的参数，为false表示使用querystring库来解析请求体的参数
app.use(express.urlencoded({ extended: true }));

// 使用body-parser解析请求体，body-parser是express的一个子模块，所以也可以使用express来解析请求体
app.use(require('body-parser').urlencoded({ extended: true }));

// 解析multipart/form-data请求体, 一般用于上传文件
app.use(express.multipart({ uploadDir: './uploads' }));

// 解析text/html请求体, 一般用于上传文件
app.use(express.text({ type: 'text/html' }));

// 解析二进制请求体
app.use(express.raw());

// 解析文本请求体
app.use(express.text());

// 解析cookie
app.use(express.cookieParser());

// 解析session
app.use(express.session());

const qs = require('querystring');

/**
 * 自定义解析请求体中间件
 * 通过req.on('data', chunk => { ... })来获取请求体数据
 * 通过req.on('end', () => { ... })来判断请求体数据是否接收完毕
 */
app.use((req, res, next) => {
    let str = '';
    // 监听请求体数据的传输
    req.on('data', chunk => {
        // 将请求体数据拼接起来
        str += chunk;
    })

    // 监听请求体数据的传输是否结束
    req.on('end', () => {
        console.log(str);
        // 将请求体数据转换为对象, 并挂载到req.body上
        req.body = qs.parse(str);
        next();
    })
})



// jwt字符串加密密钥
const jwt = require('jsonwebtoken');

// 定义一个加密密钥, 用于加密和解密jwt字符串
const secret = 'itcast';

// 将请求发生的jwt字符串解析还原成为JSON对象
const expressJwt = require('express-jwt');

// 登录后生成jwt字符串
app.post('/login', (req, res, err) => {
    const { username, password } = req.body;
    const token = jwt.sign({ username, password }, secret, { expiresIn: '24h' })
    if (err) {
        res.send({ status: 1, msg: '登录失败' });
    } else {
        res.send({ status: 0, msg: '登录成功', token });
    }
});

/**
 * 验证jwt字符串是否有效, 如果有效则将解析后的JSON对象挂载到req.user上
 * 解析后的JSON对象为用户信息，包含了加密时传入的数据
 * 后续接口中可以通过req.user获取用户信息
 * unless方法用于设置哪些请求不需要验证jwt字符串
 * 1. path: ['/login'] 表示请求路径为/login的请求不需要验证jwt字符串
 * 2. path: ['/login', '/register'] 表示请求路径为/login或/register的请求不需要验证jwt字符串
 * 3. path: [/^\/login/] 表示请求路径以/login开头的请求不需要验证jwt字符串
 */
app.use(expressJwt({ secret }).unless({ path: ['/login'] }));

// 获取用户信息
app.get('/userinfo', (req, res) => {
    consloe.log(req.query);
    res.send({
        status: 0,
        msg: 'ok',
        data: req.user,
    });
});

// post请求 id,name为动态路由参数
app.post('/user/:id/:name', (req, res) => {
    res.send({ name: 'zs', age: 18 });
});

// 创建路由对象
const router = express.Router();

/**
 * 路由中间件
 * 1. 路由中间件和应用中间件的区别
 *    应用中间件绑定到app对象上，路由中间件绑定到router对象上
 * 2. 路由中间件和路由处理函数的区别
 *    路由中间件可以处理路由，也可以处理请求参数
 *    路由处理函数只能处理路由
 * 3. 中间件必须在路由之前注册
 * 4. 路由中间件可以注册多个
 * 5. 中间件的执行顺序是从上到下，从左到右
 * 6. 中间件必须调用next()方法才能继续向下匹配路由
 */
router.use((req, res, next) => {
    console.log('路由中间件');
    next();
})

// 路由对象中的路由
router.get('/user', (req, res) => {
    res.send({
        status: 0,
        msg: 'ok',
        data: {
            name: 'zs',
            age: 18
        }
    });
})

// post请求，并且添加一个局部中间件
router.post('/user', (req, res, next) => {
    console.log('路由局部中间件');
    next();
}, (req, res) => {
    res.send({
        status: 0,
        msg: 'ok',
        data: {
            name: 'zs',
            age: 18
        }
    });
})

// 注册路由, 将路由对象挂载到app服务中, 并添加一个访问前缀/api
app.use('/api', router);

app.listen(3000, () => {
    console.log('express服务器启动：http://127.0.0.1:3000');
});