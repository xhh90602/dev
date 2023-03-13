/* eslint-disable no-console */
import objb, { c } from './b';

const obja = require('./a');

setTimeout(() => {
  console.log('b.c', c);
  console.log('a.b', obja);
  console.log('b.a', objb.a);
  console.log('b.b', objb.b);
}, 1000);

// obja.a = 3;
// obja.b.c = 4;
// objb.a = 5;
// objb.b.c = 6;
// obja = {};
