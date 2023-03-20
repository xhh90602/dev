import './index.css';
import { add } from 'lodash-es';

const box = document.createElement('div');

box.innerHTML = `Hello World${add(1, 2)}`;
box.className = 'main';

document.body.appendChild(box);

let reso;
let preArgs = [];

const obj = {
  post: () => new Promise((resolve) => {
    resolve(123);
  }),
};

const pre = () => {
  const promise = new Promise((resolve) => {
    resolve(new Promise((r) => {
      r(123);
    }));
  });

  return (...args) => {
    preArgs = args;
    return promise.then((res) => {
      console.log('🚀 ~ file: main.entry.js:26 ~ pre ~ res:', res);
      res();
    });
  };
};

pre()(1);
setTimeout(() => {
  reso(obj.post());
}, 1000);
console.log(preArgs);
