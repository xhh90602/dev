const fs = require('fs');
const path = require('path')

// 当前文件所在目录
const dirname = __dirname

fs.readFile('./fs.txt', 'utf8', (err, data) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log('文件读取成功');
    console.log(data);
})

fs.writeFile('./fs.txt', '这是写入的内容', (err) => {
    // 操作成功err不为null，否则err为错误对象
    if (err) {
        console.log(err)
    }
    console.log('文件写入成功');
})

