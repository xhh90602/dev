/* eslint-disable no-param-reassign */
import { add } from 'lodash-es';
import css from './index.css';
import './modules/all';

const box = document.createElement('div');
box.className = css.index;

const count = new Proxy({ value: 1 }, {
  get(target) {
    return target.value;
  },
  set(target, key, value) {
    box.innerHTML = `Hello World: ${value}`;
    target[key] = value;
    return true;
  },
});
box.innerHTML = `Hello World: ${count.value}`;

const button = document.createElement('button');
button.innerHTML = 'Click me1';
button.onclick = () => {
  count.value = add(count.value, 1);
};

document.body.appendChild(button);
document.body.appendChild(box);

// console.log([...Array(100).keys()]);
// console.log(Array.from(Array(100).keys()));
// console.log(Array.from(Array(100), (v, i) => i + 1));
// console.log(Array.from(Array(100).entries(), (v) => v[0] + 1));
