const http = require('http');

const app = http.createServer();

app.on('request', (req, res) => {
    console.log('监听客户端请求');
    const url = req.url;
    const method = req.method;

    res.setHeader('Content-Type', 'text/html; chatset=utf-8')


    const str = `请求URL: ${url}, 请求方法：${method}`
    console.log(str);
    // 响应数据
    res.end(str)
})

app.listen(3000, () => {
    console.log('http服务器启动：http: //127.0.0.1:3000');
})