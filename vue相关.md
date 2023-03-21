### vue2
- 响应式原理
  - Object.defineProperty
  - 通过Object.defineProperty劫持了对象的getter和setter，当数据发生变化时，通知依赖更新
  - 缺点：无法监听到对象属性的添加和删除，无法监听到数组索引和length的变化
  - 通过递归的方式，将data中的数据全部转换成getter和setter，当页面取值时，进行依赖收集，当页面修改值时，通知依赖更新
  - 通过发布订阅模式，将watcher和dep关联起来，当数据发生变化时，通知所有的watcher，让watcher去更新视图
  - 对于数组的变化，vue2是通过重写数组的方法来实现的，当数组发生变化时，会通知依赖更新
    - 重写数组原理：
    - 创建一个构造函数，原型指向Array.prototype
    - 重写数组的方法：push、pop、shift、unshift、splice、sort、reverse
    - 遍历重写的方法，通过Object.defineProperty将劫持原型上对应的方法
    - 重写的方法中，调用原生的方法，然后判断是否为响应式数据，如果是的话，通知依赖更新

  - Vue2 是通过 Object.defineProperty 将对象的属性转换成 getter/setter 的形式来进行监听它们的变化，当读取属性值的时候会触发 getter 进行依赖收集，当设置对象属性值的时候会触发 setter 进行向相关依赖发送通知，从而进行相关操作。
  - 由于 Object.defineProperty 只对属性 key 进行监听，无法对引用对象进行监听，所以在 Vue2 中创建一个了 Observer 类对整个对象的依赖进行管理，当对响应式对象进行新增或者删除则由响应式对象中的 dep 通知相关依赖进行更新操作。
  - Object.defineProperty 也可以实现对数组的监听的，但因为性能的原因 Vue2 放弃了这种方案，改由重写数组原型对象上的 7 个能操作数组内容的变更的方法，从而实现对数组的响应式监听。

### vue3
- 响应式原理
  - Proxy
  - 通过Proxy劫持了对象的getter和setter，当数据发生变化时，通知依赖更新
  - 优点：可以监听到对象属性的添加和删除，可以监听到数组索引和length的变化
  - Vue3 则是通过 Proxy 对数据实现 getter/setter 代理，从而实现响应式数据，然后在副作用函数中读取响应式数据的时候，就会触发 Proxy 的 getter，在 getter 里面把对当前的副作用函数保存起来，将来对应响应式数据发生更改的话，则把之前保存起来的副作用函数取出来执行。
  - Vue3 对数组实现代理时，用于代理普通对象的大部分代码可以继续使用，但由于对数组的操作与对普通对象的操作存在很多的不同，那么也需要对这些不同的操作实现正确的响应式联系或触发响应。这就需要对数组原型上的一些方法进行重写。
  - 比如通过索引为数组设置新的元素，可能会隐式地修改数组的 length 属性的值。同时如果修改数组的 length 属性的值，也可能会间接影响数组中的已有元素。另外用户通过 includes、indexOf 以及 lastIndexOf 等对数组元素进行查找时，可能是使用代理对象进行查找，也有可能使用原始值进行查找，所以我们就需要重写这些数组的查找方法，从而实现用户的需求。原理很简单，当用户使用这些方法查找元素时，先去响应式对象中查找，如果没找到，则再去原始值中查找。
  - 另外如果使用 push、pop、shift、unshift、splice 这些方法操作响应式数组对象时会间接读取和设置数组的 length 属性，所以我们也需要对这些数组的原型方法进行重新，让当使用这些方法间接读取 length 属性时禁止进行依赖追踪，这样就可以断开 length 属性与副作用函数之间的响应式联系了。

- ref 实现原理
  - 将原始值类型包装成对象(RefImpl类的实例就是对象)
  - ref不关心数据类型 数组对象基础数据类型都可以
  - 检测到得到的是对象的话就 用reactive转成proxy

- reactive 实现原理
  - 通过Proxy劫持了对象的getter和setter，当数据发生变化时，通知依赖更新
  - 判断是否只读或者已经是代理对象，是的话直接返回
  - 判断对象类型，将Object和Array与Map,Set, WeakMap,WeakSet区分开来
  - 在new proxy的时候，根据对象类型，对不同的对象进行不同的处理
  - proxy 对 get、 set、 deleteProperty、 has、 ownKeys 进行了重写
  - get方法中，收集依赖
  - set方法中，通知依赖更新
  - deleteProperty方法中，通知依赖更新
  - has方法中，收集依赖
  - ownKeys方法中，收集依赖

- ref 和 reactive 的区别
  - ref返回的是一个对象，reactive返回的是一个代理对象
  - ref内部使用的是class封装处理响应式，reactive内部使用的是Proxy处理响应式
  - 使用ref声明的响应式对象可以通过直接赋值修改对象
  - 使用reactive声明的响应式对象不可以通过直接赋值修改对象

- computed 实现原理
  - computed是一个函数，接收一个getter函数，返回一个ref对象
  - computed函数内部会调用effect函数，将getter函数作为effect函数的回调函数
  - effect函数内部会调用track函数，收集依赖
  - effect函数内部会调用trigger函数，通知依赖更新


### proxy 和 defineProperty 的区别
- Proxy代理整个对象，Object.defineProperty只代理对象上的某个属性。
- 如果对象内部要全部递归代理，则Proxy可以只在调用时递归，而Object.defineProperty需要在一开始就全部递归，Proxy性能优于Object.defineProperty。
- 对象上定义新属性时，Proxy可以监听到，Object.defineProperty监听不到。
- 数组新增删除修改时，Proxy可以监听到，Object.defineProperty监听不到。
- Proxy不兼容IE，Object.defineProperty不兼容IE8及以下。
