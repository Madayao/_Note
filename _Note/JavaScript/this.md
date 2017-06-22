@(JavaScript)[js, this, oop]
# [`this`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/this)

this 是在程序运行的时候才能确定的

简单来说, 谁调用谁就是 this. 即 `.` 左边的对象

## 全局上下文

在全局运行上下文中（在任何函数体外部），this指代全局对象

浏览器中是 window

## 函数中的 `this`

在函数内部，this 的值取决于函数是如何调用的。

### 对象方法中的 `this`

当以对象里的方法的方式调用函数时，它们的 this 是调用该函数的对象.

#### 原型链中的 **this**

如果该方法存在于一个对象的原型链上，那么this指向的是调用这个方法的对象，表现得好像是这个方法就存在于这个对象上一样。

####  getter 与 setter 中的 this

作为getter或setter函数都会绑定 this 到从设置属性或得到属性的那个对象。

### 构造函数中的 this

当一个函数被作为一个构造函数来使用（使用new关键字），它的this与即将被创建的新对象绑定。

### [`call`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call) [`apply`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)

`fun.apply(thisArg, [argsArray])`

`fun.call(thisArg[, arg1[, arg2[, ...]]])`
函数对象的方法, 绑定 this 到一个指定的对象上。

决定是谁调用这个函数 (个人看法)

区别，就是 call()方法接受的是若干个参数的列表，而apply()方法接受的是一个包含多个参数的数组

当一个函数的函数体中使用了this关键字时，通过所有函数都从Function对象的原型中继承的[call()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)方法和[apply()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/apply)方法调用时，它的值可以绑定到一个指定的对象上。

### [`bind`](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind?)

`fun.bind(thisArg[, arg1[, arg2[, ...]]])`

函数对象的方法, 绑定 this 到一个指定的对象上。返回一个几乎一致但绑定了 this 的函数

可以给函数添加额外参数, 放置于原函数参数之前

## DOM 中的 `this`

### DOM事件处理函数中的 this

当函数被用作事件处理函数时，它的this指向触发事件的元素（一些浏览器在使用非addEventListener的函数动态添加监听函数时不遵守这个约定）。

### 内联事件处理函数中的 this

当代码被内联处理函数调用时，它的this指向监听器所在的DOM元素