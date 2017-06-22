# AJAX

可以直接在当前页面发送响应接收数据

## 代码表

| 代码                                       | 描述                                       |
| ---------------------------------------- | ---------------------------------------- |
| `var r = new XMLHttpRequest()`           | 套路,启用 AJAX                               |
| `r.open('GET', '/login', true)`          | 三个变量, 请求格式, 路径, 是否异步                     |
| `r.setRequestHeader('Content-Type', 'application/json')` | 设置文件类型, 数据格式                             |
| `r.onreadystatechange = function(){}`    | 服务器有响应后执行的函数, 状态码`readyState` = 4时, 服务器响应成功 |
| `r.send()`                               | 发送数据                                     |

### 函数封装
```js
var ajax = function(method, path, headers, data, reseponseCallback) {
    var r = new XMLHttpRequest()
    r.open(method, path, true)
    r.setRequestHeader('Content-Type', 'application/json')
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            reseponseCallback(r)
        }
    }
    r.send(data)
}
```

## 发送请求

```javascript
var r = new XMLHttpRequest()
r.open('POST', '/login', true)
r.setRequestHeader('Content-Type', 'application/json')
r.onreadystatechange = function(){
    if(r.readyState  === 4){
        console.log('state change', r)
        var response = JSON.parse(r.response)
        console.log('response', response)
    } else {
        console.log('change')
    }
}
var account = {
    username: 'GyonGyon',
    password: '920213',
}
var data = JSON.stringify(account)
r.send(data)
```



## 获取登录页面
```js
// 创建 AJAX 对象
var r = new XMLHttpRequest()
// 设置请求方法和请求地址
r.open('GET', '/login', true)
// 注册响应函数
r.onreadystatechange = function() {
    if(r.readyState == 4) {
        console.log('请求成功', r.responseText.length)
    }
}
// 发送请求
r.send()
```


## 发送登录数据
```js
// 创建 AJAX 对象
var r = new XMLHttpRequest()
// 设置请求方法和请求地址
r.open('POST', '/login', true)
// 设置发送的数据的格式
r.setRequestHeader('Content-Type', 'application/json')
// 注册响应函数
r.onreadystatechange = function() {
    if (r.readyState === 4) {
        console.log('state change', r, r.status, r.response)
        var response = JSON.parse(r.response)
        console.log('response', response)
    } else {
        console.log('change')
    }
}
// 发送请求
var account = {
    username: 'gua',
    password: '123',
}
var data = JSON.stringify(account)
r.send(data)
```

## 封装成这样的一个函数
```js
var ajax = function(method, path, headers, data, reseponseCallback) {
    var r = new XMLHttpRequest()
    // 设置请求方法和请求地址
    r.open(method, path, true)
    // 设置发送的数据的格式
    r.setRequestHeader('Content-Type', 'application/json')
    // 注册响应函数
    r.onreadystatechange = function() {
        if(r.readyState === 4) {
            reseponseCallback(r)
        }
    }
    r.send(data)
}

ajax('GET', '/login', null, '', function(r){
    console.log(r.status, r.response)
})

ajax('GET', 'https://api.douban.com/v2/book/1220562', null, '', function(r){
    var book = JSON.parse(r.response)
    var imgUrl = book.image
    var body = document.querySelector('body')
    var img = `
        <img src=${imgUrl}>
    `
    body.insertAdjacentHTML('beforeend', img)
})


ajax('GET', '/v2/movie/subject/1764796', null, '', function(r){
    var movie = JSON.parse(r.response)
    console.log(movie)
})
```


