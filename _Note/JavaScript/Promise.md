@(JS.Library)[js,Library,回调,异步]



# [Promise](http://liubin.org/promises-book/)


# 目录

[TOC]

## 简介

Promise 是抽象异步处理对象以及对其进行各种操作的组件
简而言之, 就是让异步操作变得好看一些

Promise 的用法如下

这是一个完整的参考, 如果有兴趣以后可以翻翻看
但是现在没必要看了
[promise 迷你书](http://liubin.org/promises-book/)

## 初始
将 fs.readFile 的操作封装成 promise，这样就可以使用 promise 的 api 了
一般前端的写法
`return new Promise(function(resolve, reject) {})`
太复杂, 最好用变量接一下
```JavaScript
const readFile = function(filename) {
    const p = new Promise(function(resolve, reject) {
        const fs = require('fs')
        const options = {
            encoding: 'utf8'
        }
        fs.readFile(filename, options, function(error, content) {
            if (error !== null) {
                reject(error)
            } else {
                resolve(content)
            }
        })
    })
    return p
}
```
## then
使用 promise 读取文件就不用写成回调的形式了
直接按照同步的写法就好了
支持链式调用
可以无限 .then, 只要你保证上一个 then 返回了东西即可
上一个 then 的返回值是下一个 then 的参数, 即用 c1 接下了变量 c
```JavaScript
let promise = readFile('foo.txt')
promise.then(function(content) {
    console.log('debug file content', content)
    const r = content + ' suffix1'
    return r
}, function(error) {
    console.log('debug error message', error)
}).then(function(c) {
    console.log('second then', c)
    const r = c + ' suffix2'
    return r
}).then(function(c) {
    console.log('third then', c)
})
console.log('MARK ****** 首先 log 的是这一行')
```

## catch
上面的写法也可以写成下面这样
catch 相当于错误
把 reject 的操作放在 catch 里面
```JavaScript
promise.then(function(content) {
    console.log('debug file content', content)
}).catch(function(error) {
    console.log('debug error message', error)
})
```

## all
有时候会碰到批量执行异步操作，如果直接用循环 + 调用函数的形式会比较麻烦
使用 Promise.all 就很方便了
all 方法是直接挂在 Promise 类上的，而 then catch 这些方法是挂在原型上
Promise.all 会把数组里面所有的 promise 对象都执行完后才进行下一步操作
再往下调用
```JavaScript
const fileList = [
    't1.txt',
    't2.txt',
    't3.txt',
]
const list = fileList.map(function(item) {
    const r = readFile(item)
    return r
})
Promise.all(list).then(function(content) {
    console.log('Promise.all, content', content)
})
```

### for of 写法
for of 是 es6 提出的新语法
注意, 只能用于 array, 不能用于 object 遍历 key
```JavaScript
const list = []
for(var filename of fileList) {
    const r = readFile(filename)
    list.push(r)
}
```


### 不用 all
如果不用 Promise.all 那么下面的方法也是可行的
就是恶心了点
```JavaScript
var ready = {}
ready.a1 = true
ready.a2 = true
ready.a3 = true
const fs = require('fs')
const options = {
    encoding: 'utf8'
}
fs.readFile('t1.txt', options, function(error, content) {
    if (error !== null) {
    } else {
        ready.a1 = true
        if(ready.a1 && ready.a2 && ready.a3) {
            console.log('都成功了')
        }
    }
})
fs.readFile('t2.txt', options, function(error, content) {
    if (error !== null) {
    } else {
        ready.a2 = true
        if(ready.a1 && ready.a2 && ready.a3) {
            console.log('都成功了')
        }
    }
})
fs.readFile('t3.txt', options, function(error, content) {
    if (error !== null) {
    } else {
        ready.a3 = true
        if(ready.a1 && ready.a2 && ready.a3) {
            console.log('都成功了')
        }
    }
})
```
```
ready.a1 = true
ready.a2 = true
ready.a3 = true
...
所有的都为真才成功
```

### 链式写法
```
var a = {
    b: {
        c: {
            d: {
                name: 'gua'
            }
        }
    }
}
```
