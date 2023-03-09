import { add } from 'lodash-es';
import './index.css';

let count = new Proxy({value: 1}, {
  get: function(target, key) {
    return target.value;
  },
  set: function(target, key, value) {
    box.innerHTML = `Hello World: ${value}`;
    target[key] = value;
    return true;
  }
});


const button = document.createElement('button');
button.innerHTML = 'Click me';
button.onclick = () => {
  count.value = add(count.value, 1);
};
document.body.appendChild(button);



const box = document.createElement('div');
box.innerHTML = `Hello World: ${count.value}`;
box.className = 'index';

document.body.appendChild(box);
