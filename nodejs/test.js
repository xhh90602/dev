console.clear();
a = 1;
var b = 2;
const c = 3;

const obj = {
  a: 4,
  b: 5,
  c: 6,
  fn: function () {
    // this指向obj
    console.log(this.a, this.b, this.c);
  },
  fn1: () => {
    // 箭头函数中的this指向定义时的上下文
    console.log(this.a, this.b, this.c);
  },
  fn2: function () {
    return () => {
      // 箭头函数中的this指向定义时的上下文
      console.log(this.a, this.b, this.c);
    }
  }
}

const fn = function () {
  console.log(this.a, this.b, this.c);
}

const fn1 = () => {
  console.log(this.a, this.b, this.c);
}

function fn2() {
  console.log(this.a, this.b, this.c);
}

obj.fn2.call({a:1})()


function foo(a, b) {
  console.log(a, b);
}

const bar = () => (...args) => {
  const s = foo.apply(null, [1, ...args]);
  return s
};

bar()(8);
