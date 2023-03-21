/* eslint-disable no-param-reassign */
import './index.css';
import { add } from 'lodash-es';

const box = document.createElement('div');

box.innerHTML = `Hello World${add(1, 2)}`;
box.className = 'main';

document.body.appendChild(box);

const arrproxy = new Proxy([1, 2, 3], {
  get(target, key) {
    console.log('get', target, key);
    return target[key];
  },
  set(target, key, value) {
    console.log('set', target, key, value);
    return Reflect.set(target, key, value);
  },
});

arrproxy.push(41);

console.log(arrproxy.indexOf(2));
