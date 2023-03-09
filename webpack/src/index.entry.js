/* eslint-disable no-param-reassign */
import { add } from 'lodash';
import './index.css';

const box = document.createElement('div');
box.className = 'index';

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
button.innerHTML = 'Click me';
button.onclick = () => {
  count.value = add(count.value, 1);
};

document.body.appendChild(button);
document.body.appendChild(box);
