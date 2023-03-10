import './index.css';
import { add } from 'lodash-es';

const box = document.createElement('div');

box.innerHTML = `Hello World${add(1, 2)}`;
box.className = 'main';

document.body.appendChild(box);
