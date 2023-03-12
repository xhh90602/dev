/* eslint-disable no-console */
// const { cloneDeep } = require('lodash-es');

let a = 1;
const obj = {
  a,
  b: {
    c: 2,
  },
};

setTimeout(() => {
  // commonjs的require引入的模块, 会被缓存, 所以这里的修改会影响到all.js中的a.a和a.b.c
  a = 3; // 会影响到all.js中的a.a
  obj.b.c = 4; // 会影响到all.js中的a.b.c
  // console.log('a.a', a);
  // console.log('a.a', obj.a);
  // console.log('a.b', obj.b);
}, 500);

module.exports = a;
