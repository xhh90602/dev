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
    - 重写的方法中，调用原生的方法，再通知依赖更新


### vue3
- 响应式原理
  - Proxy
  - 通过Proxy劫持了对象的getter和setter，当数据发生变化时，通知依赖更新
  - 优点：可以监听到对象属性的添加和删除，可以监听到数组索引和length的变化

- ref 实现原理
  - 将原始值类型包装成对象(RefImpl类的实例就是对象)
  - ref不关心数据类型 数组对象基础数据类型都可以
  - 检测到得到的是对象的话就 用reactive转成proxy

- reactive 实现原理

- ref 和 reactive 的区别

### proxy 和 defineProperty 的区别
- Proxy代理整个对象，Object.defineProperty只代理对象上的某个属性。
- 如果对象内部要全部递归代理，则Proxy可以只在调用时递归，而Object.defineProperty需要在一开始就全部递归，Proxy性能优于Object.defineProperty。
- 对象上定义新属性时，Proxy可以监听到，Object.defineProperty监听不到。
- 数组新增删除修改时，Proxy可以监听到，Object.defineProperty监听不到。
- Proxy不兼容IE，Object.defineProperty不兼容IE8及以下。
