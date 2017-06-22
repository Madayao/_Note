@(node)[node, class]

# 类

## 创建类
`class ClassName {}` ES6
`function ClassName(){}` ES5

# 类的方法

| 名称       | 语法 ES6                   | 语法 ES5                                   | 调用                       | 实例                                       |
| -------- | ------------------------ | ---------------------------------------- | ------------------------ | ---------------------------------------- |
| 构造方法     | `constructor() {}`       | `function ClassName(){}`                 | new 时自动调用                |                                          |
| 静态方法     | `static methodName() {}` | `ClassName.methodName = function(){}`    | `ClassName.methodName()` | `Object.keys(object)` ; `Array.isArray(object)` |
| 实例(原型)方法 | `methodName(){}`         | `ClassName.prototype.methodName = function(){}` | `object.methodName()`    | `object.toString()`;`array.push()`       |
|          |                          |                                          |                          |                                          |

# 类的继承

| 方法       | 是否继承      | 备注                         |
| -------- | --------- | -------------------------- |
| 构造方法     | 必须继承      | new 新的实例时, 会调用类以及所有父类的构造函数 |
| 静态方法     | 无法继承      |                            |
| 实例(原型)方法 | 没有覆盖就可以继承 | 从自身当前类依次向上级类查找, 调用最近的实例方法  |

## 代码

```js
class Subclass exptends Superclass{
	constructor(){
		super()
	}
}
```

`class Subclass exptends Superclass{}` 创建子类

## 构造方法

在子类 constructor 中必须调用 super() 否则会报错: `this is not defined`

new 新的实例时, 会调用类以及所有父类的构造函数

## 实例方法

原型链

从自身的实例方法查找, 没有对应的方法被声明再找父类, 依次向上级类查找

# 类中的 this

| 名称                    | 静态方法      | 实例(原型)方法  | 构造方法      |
| --------------------- | --------- | --------- | --------- |
| this                  | 类         | 实例        | 实例?       |
| this.constructor      | 函数?       | 类         | 类         |
| this.name             | 类名        | undefined | undefined |
| this.constructor.name | Function? | 类名        | 类名        |