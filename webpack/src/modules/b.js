/* eslint-disable no-console */
let a = 1;

const b = {
  c: 2,
};

setTimeout(() => {
  a = 3; // 直接赋值, 不会影响到all.js中的b.a
  b.c = 4; // 通过引用赋值, 会影响到all.js中的b.b.c
  // console.log('b.a', a);
  // console.log('b.b', b);
}, 500);

export default {
  a,
  b,
};
