const fs = require('fs')
const path = require('path')
const cnchar = require('cnchar')
const trad = require('cnchar-trad')
cnchar.use(trad)

const [
    zhFileName = 'cn.json', // 简体文件名
    twFileName = 'tw.json', // 繁体文件名
    filePath = process.env.INIT_CWD, // 文件所在目录路径
] = process.argv.slice(2)

const genaterTw = (dataStr) => {
    fs.writeFile(path.join(filePath, twFileName), dataStr, (err) => {
        if (err) {
            console.log('写入文件失败!');
        } else {
            console.log('文件写入成功:', JSON.parse(dataStr));
        }
    })
}

fs.readFile(path.join(filePath, zhFileName), 'utf-8', (err, dataStr) => {
    if (err) {
        console.log('文件读取错误！', err);
    } else {
        console.log('文件读取成功:', JSON.parse(dataStr));
        const data = JSON.parse(dataStr);
        Object.keys(data).forEach(key => {
            data[key] = cnchar.convert.simpleToTrad(data[key])
        });
        genaterTw(JSON.stringify(data, null, 4))
    }
})