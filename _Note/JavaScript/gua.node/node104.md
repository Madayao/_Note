
@(后端.萧大)[node]
# node
## 目录

[TOC]

## 知识点

# 预习
cookie 是什么
客户端和服务器怎么实现 cookie
session 是什么
session 有什么用
客户端和服务器怎么实现 session
session 持久化（持久化就是重启后仍然可以使用）的两种方式
保存到文件
对称加密
session 共享

抓包软件 fiddler


作业中 model 类的新增方法实现
如何管理重复的数据
如何查找数据

# 解包
1 0240
## Array
```js
var a = 1
var b = 2
var [a, b] = [b, a]
```
交换 a, b 的值

## Object
```js
var obj = {
    m: 'm1',
    n: 'm2',
}

var { m, n } = obj
```
将 m1 m1 赋值给 m, n

## Function
```js
var bar = function() {
    var m = 'm1'
    var n = 'm2'
    return {m, n}
}
var { m, n } = bar()
```
将函数的返回值赋值给 m, n
`const { protocol, host, port, path } = parsedUrl(url)``

# es5 中 Array 的新方法
es5 中数组添加了几个方法, map forEach filter every some
map 就是用一个旧数组生成一个新数组
```js
var l1 = [1, 2, 3,]
var l2 = []
for (var i = 0; i < l1.length; i++) {
    var e = l1[i]
    var r = e * 2
    l2.push(r)
}

var l3 = l1.map(e => e * 2)
var l4 = l1.map((e) => {
    var r = e * 2
    return r
})

var l5 = l1.map((e) => {
    if (e % 2 === 0) {
        return e * 2
    }
})


var odd = l1.filter((e) => {
    return e % 2 === 0
})

var l6 = odd.map((e) => {
    return e * 2
})

var shit = l2.filter(e => e % 2 === 0).map(e => e * 2)
```

箭头函数删去大括号 {} 时, 是一个隐式的返回值, 会自动 return 这一行的值
只有一个参数时, 可以删去圆括号 ()

# session
1 2910

跨页面保存信息, 不同页面的信息交流
如 购物车信息, 登录者身份
把需要跨页面保存的信息存放于请求头的 Cookie 中

## 简要流程
- 服务器:
  接收请求
  解析请求, 发现需要跨页面保存的信息 M
  储存信息到 session 中, sessionID 和 信息一一映射(?)
  发送响应, 添加响应头部 `Set-Cookie: <cookie>`, cookie 格式可自定(?)
- 客户端:
  接收响应
  解析响应, 发现 Set-Cookie 头后储存 Cookie 到 PC
  再次发送请求, 添加请求头部 `Cookie: <cookie>`
- 服务器:
  再次接收请求
  解析, 发现 Cookie 请求头部
  查找 session 中对应的信息, 即为需跨页面保存的信息 M, 如用户身份

## 示例, 用户免登陆
### [s]初始化
```js
const u = {}
const u.username = 'name'
const headers = {}
const session = {}
const key = `sessionID`
```
| 变量       | 备注                                       |
| -------- | ---------------------------------------- |
| u        | 用户信息解析的对象                                |
| username | u 中保存用户名的属性, 定为 name                     |
| headers  | 响应头                                      |
| session  | 需要跨页面保存的信息解析的对象                          |
| key      | 随机字符串, session 保存不同用户信息的 key, 在这里用来和用户名映射(?), 定为 sessionID |

### [s]赋值, 储存信息
```js
session[key] = u.username
headers['Set-Cookie'] = `user=${key}`
```
此时的值:
```js
u = {
    'username': 'name'
}
session = {
    'sessionID': 'name'
}
headers = {
    'Set-Cookie': 'user=sessionID'
}
```
### [s]发送 Set-Cookie 头
服务器会返回包含 headers 在内的响应, 其中响应头会有 Set-Cookie
`Set-Cookie:user=sessionID`

### [c]解析并储存 cookie
浏览器检查到 headers 里有 Set-Cookie, 会在用户 PC 里储存 Cookie 为 Set-Cookie 的值

### [c]发送 Cookie 头
再次访问网页时, 浏览器会发送请求, 其中请求头会有 Cookie
`Cookie:user=sessionID`
发送此 Cookie 到服务器, 服务器就可以利用 session 中的映射确认用户身份
```js
const currentUser = request => {
    const id = request.cookies.user
    return session[id] === undefined || 游客
}
```
解析 Cookie 头, 获得之前的  session 的 key 并返回 session[key], 这里是 username, 不存在返回游客
服务器有时只需要部分 Cookie 信息

??? session 里都可以保存什么? 保存购物车的具体代码是什么?

### [s]解析 cookie
```js
addCookies() {
    const cookies = this.headers.Cookie || ''
    const pairs = cookies.split('; ')
    pairs.forEach((pair) => {
        if (pair.includes('=')) {
            const [k, v] = pair.split('=')
            this.cookies[k] = v
        }
    })
}
addHeaders(headers) {
    headers.forEach((header) => {
        const [k, v] = header.split(': ')
        this.headers[k] = v
    })
    this.addCookies()
}
```
解构, 遍历赋值
解析收到的请求头, 并赋值为一个对象, 其中的 Cookie 亦为一个对象

### [s]匹配用户
```js
const currentUser = (request) => {
    const id = request.cookies.user || ''
    const username = session[id] === undefined || '游客'
    return username
}
```
找到请求的 Cookie 头中的 user
作为 key 找到 session 中相应的值, 即为用户名

# 校验逻辑
## 登录
```js
static findOne(key, value) {
    const all = this.all()
    let model = null
    all.forEach((m) => {
        if (m[key] === value) {
            model = m
            return false
        }
    })
    return model
}
validateLogin() {
    const u = User.findOne('username', this.username)
    return u !== null && u.password === this.password
}
```
原型方法, this 指向实例
findOne 是静态方法, 需要类来调用
`return false` callback 函数的返回值, 不影响外部, 这里用于中断遍历(?)
u !== null 不要简写, 避免使用隐式转换

# id
```js
save() {
    const cls = this.constructor
    const models = cls.all()
    console.log('debug models', models)
    if (this.id === undefined) {
        if (models.length > 0) {
            const last = models[models.length - 1]
            this.id = last.id + 1
        } else {
            this.id = 0
        }
        models.push(this)
    } else {
        let index = -1
        models.forEach((m, i) => {
            if (m.id === this.id) {
                index = i
                return false
            }
        })
        if (index > -1) {
            models[index] = this
        }
    }
    const path = cls.dbPath()
    save(models, path)
}
```
实例方法, 没有 id 就添加新 id, 有 id 就遍历匹配, 添加到 models 里

# MVC
| MVC | |
|---|---|
| Model       | 模型, 这里是数据 |
| View        | 视图, 这里是页面 html |
| Controller  | 控制器, 这里是路由 route |
低耦合, 方便 debug/修改/测试,
