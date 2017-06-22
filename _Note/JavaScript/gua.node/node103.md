@(后端.萧大)[node]
# node103
## 目录

[TOC]

## 知识点

# 预习
1 0525
static 目录中存储了图片
templates 目录中存储了 html 文件

models.js 是数据存储的代码(重点 难点)
request.js 是封装了 Request 类的代码, 主要用来保存请求信息(重点)
routes.js 是服务器能处理的 path(路由) 和 路由处理函数
server.js 是扩展的服务器代码, 详细流程功能说明请看后文
utils.js 包含了 log 函数, common 工具


MVC 设计模式（一个经典有用的套路）
Model       数据
View        显示
Controller  控制器


以下是 node3 的 server.js 的整理思路
3 2831
server.js
    配置 host 和端口
    监听请求
    接收请求
        解析请求信息
            raw
            method
            path
            query
            body
        保存请求
            临时保存, 用完就丢
    处理请求
        获取路由对象
            path 和响应函数的映射对象
        根据请求的 path 和对象处理请求并获得返回页面
            routes
                index
                    返回页面
                login
                    处理 post 请求
                        对比 post 数据和用户数据
                        返回登录结果
                    返回页面
                register
                    处理 post 请求
                        对比 post 数据和注册规则
                        保存合法的注册信息
                            保存到 user.txt
                        返回注册结果
                    返回页面
                message
                    处理 post 请求
                        将 post 的数据加入到 messageList
                    返回页面
                        包含留言列表
                静态资源(图片)
                    根据 query 的内容返回对应的资源
        返回响应内容
    发送响应内容
    关闭请求连接



# util.js
2230
## code
```js
const log = (...args) => {
    console.log.apply(console, args)
}

module.exports = log
```
## 封装 console.log
```js
const log = (...args) => {
    console.log.apply(console, args)
}
```
## 暴露
```js
module.exports = log
```
`module.exports = variable`
把封装之后的 log 函数暴露出去, 这样在其他地方就可以直接使用了
exports.log = log

## module.exports 与 exports. 区别
默认情况下 module.exports 和 exports 指向同一个对象
exports 相当于 module.exports 简写/ 别名
```js
module.exports = {}
exports = module.exports
```
```js
exports.log = log
```
相当于
```js
exports = {
    log: log,
}
```

```js
module.exports = {
    log: log,
}
```

# model.js
2515
## code
```js
const fs = require('fs')
const log = require('./utils')
const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}
const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}
const load = (path) => {
    const options = {
        encoding: 'utf8',
    }
    ensureExists(path)
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}
class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = `${classname}.txt`
        return path
    }
    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map((item) => {
            const cls = this
            const instance = cls.create(item)
            return instance
        })
        return ms
    }
    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }
    save() {
        const cls = this.constructor
        const models = cls.all()
        models.push(this)
        const path = cls.dbPath()
        save(models, path)
    }
    toString_debug() {
        const classname = this.constructor.name
        console.log('debug classname', classname)
        const keys = Object.keys(this)
        const properties = keys.map((k) => {
            const v = this[k]
            const s = `${k}: (${v})`
            return s
        }).join('\n  ')
        const s = `< ${classname}: \n  ${properties}\n>\n`
        return s
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}
class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
    }
    validateLogin() {
        log(this, this.username, this.password)
        return this.username === 'gua' && this.password === '123'
    }
    validateRegister() {
        return this.username.length > 2 && this.password.length > 2
    }
}
class Message extends Model {
    constructor(form={}) {
        super()
        this.author = form.author || ''
        this.content = form.content || ''
        this.extra = 'extra message'
    }
}
module.exports = {
    User: User,
    Message: Message,
}


```
## 引入模块
```js
const fs = require('fs')
const log = require('./utils')
```
## 确保文件存在
如果不存在就直接创建这个文件, 这样在调用的时候不会报错
```js
const ensureExists = (path) => {
    if (!fs.existsSync(path)) {
        const data = '[]'
        fs.writeFileSync(path, data)
    }
}

`const data = '[]'` 因为保存的数据都是 json 格式的, 所以在初始化文件的时候写入一个空数组
```

## 保存文件
将数据(object 或者 array)写入到文件中, 相当于持久化保存数据
data 是 object 或者 array
path 是 保存文件的路径
```js
const save = (data, path) => {
    const s = JSON.stringify(data, null, 2)
    fs.writeFileSync(path, s)
}
```
`JSON.stringify(data, null, 2)` | 格式化文件
默认情况下使用 JSON.stringify 返回的是一行数据
开发的时候不利于读
所以格式化成缩进 2 个空格的形式

## 读取文件
从文件中读取数据, 并且转成 JSON 形式(即 object 或者 array)
path 是保存文件的路径
```js
const load = (path) => {
    ensureExists(path)
    const options = {
        encoding: 'utf8',
    }
    const s = fs.readFileSync(path, options)
    const data = JSON.parse(s)
    return data
}
```

`ensureExists(path)` 读取之前确保文件已经存在, 这样不会报错
```js
const options = {
    encoding: 'utf8',
}
const s = fs.readFileSync(path, options)
```
指定 encoding 参数, 避免后续处理
指定 encoding 参数后, readFileSync 返回的就不是 buffer, 而是字符串


# 类
2925

为了方便处理数据, 把所有方法打包在一起
Object 和 Array 都是类
`var o = {}` 相当于 `var o = new Object()`
`var l = []` 相当于 `var l = new Array()`

## 创建类
`class ClassName {}`
`function ClassName(){}`

## 构造方法
`constructor() {}`
`function ClassName(){}`, 在 {} 直接写
在 new 的时候就会执行

### 调用
自动调用

### 继承
使用 super() 继承父类构造方法(ES6)

## 静态方法
`static methodName() {}`
`ClassName.methodName = function(){}`
加了 static 关键字的方法是静态方法

### 调用
`ClassName.methodName()`
直接用 类名.方法名() 的形式调用
这里的类名是 Model, 所以调用的方式就是 Model.dbPath()

### 继承
无法被继承

### 实例
Object.keys(o)
Array.isArray(a)

### this
this: 类
this.name: 类名

## 实例方法(原型方法)
`methodName(){}`
`ClassName.prototype.methodName = function(){}`
save 前面没有 static 关键字, 是实例方法或者原型方法

### 调用
`object.methodName()`
调用方式是 实例.方法()

### 实例
`o.toString()` `toString` 是一个原型方法(也叫实例方法)
`a.push(s)` `push`

### 继承


### this
this: 实例, 即 new 出的对象
this.constructor: 类

## 基类
2 0110
定义一个 Model 类来处理数据相关的操作
Model 是基类, 可以被其他类继承
```js
class Model {
    static dbPath() {
        const classname = this.name.toLowerCase()
        const path = `${classname}.txt`
        return path
    }
    static all() {
        const path = this.dbPath()
        const models = load(path)
        const ms = models.map((item) => {
            const cls = this
            const instance = cls.create(item)
            return instance
        })
        return ms
    }
    static create(form={}) {
        const cls = this
        const instance = new cls(form)
        return instance
    }
    save() {
        const cls = this.constructor
        const models = cls.all()
        models.push(this)
        const path = cls.dbPath()
        save(models, path)
    }
    toString_debug() {
        const classname = this.constructor.name
        console.log('debug classname', classname)
        const keys = Object.keys(this)
        const properties = keys.map((k) => {
            const v = this[k]
            const s = `${k}: (${v})`
            return s
        }).join('\n  ')
        const s = `< ${classname}: \n  ${properties}\n>\n`
        return s
    }

    toString() {
        const s = JSON.stringify(this, null, 2)
        return s
    }
}

```

### dbPath
```js
static dbPath() {
    const classname = this.name.toLowerCase()
    const path = `${classname}.txt`
    return path
}
```
dbPath 方法返回 db 文件的路径
静态方法中的 this 指的是类
this.name 指的是类名, 类名是一个字符串 'Model'
`this.name.toLowerCase()` 文件名一般来说建议全小写, 所以这里将名字换成了小写
db 的文件名通过这样的方式与类名关联在一起
db 文件 这里应该是 数据文件, 每个类处理不同的数据, 并储存在相应 txt 文件里
Users 对应 users.txt
Message 对应 message.txt

### 获取所有实例(重要)
```js
static all() {
    const path = this.dbPath()
    const models = load(path)
    const ms = models.map((item) => {
        const instance = this.create(item)
        return instance
        // return this.create(item)
    })
    return ms
    // return models.map(m => this.create(m))
```
这个函数是用来获取一个类的所有实例
用法如下: 类名.all()

`const path = this.dbPath()`先获取文件路径

`const models = load(path)` 打开文件, 获取数据
初始化时使用的 json 格式存储, 数据类型是数组, 之后保存也是数组
所以 models 是一个数组

#### map
map 是 es5 里新增的方法, 可以方便地遍历数组
map 是用一个旧数组生成一个新数组

#### 简化
item 是数组中的每一项
前面提到了静态方法中的 this 指向的是 class
调用 this.create 方法生成实例

```js
const ms = models.map((item) => {
    const instance = this.create(item)
    return instance
    // return this.create(item)
})
return ms
```
与箭头函数结合使用, 可以简写成以下一行
```js
return models.map(m => this.create(m))
```
不容易理解, 所以初期不建议这样写代码
上面的代码换成 for 循环写如下:
```js
const ms = []
for (let i = 0; i < models.length; i++) {
    const item = models[i]
    const instance = this.create(item)
    ms.push(instance)
    }
return ms
```
### 封装实例创建
```js
static create(form={}) {
    const instance = new this(form)
    return instance
}
```
我们把创建实例的操作封装起来, 直接调用 create 方法就可以了
每个类都有 create 的操作, 所以可以直接将这个操作写到 Model 中
### 保存实例
```js
save() {
    const cls = this.constructor
    const models = cls.all()
    models.push(this)
    const path = cls.dbPath()
    save(models, path)
}
```
save 函数的作用是把 Model 的一个实例保存到文件中

实例方法中的 this 指向的是实例本身, 也就是 new 出来的那个对象
this.constructor 是指类

`const models = cls.all()`
先获取 Model 的所有实例, 是一个数组

`models.push(this)`
然后把当前实例添加到 models 中

`const path = cls.dbPath()`
拿到路径
`save(models, path)`
保存到文件中
这个 save 函数是 save 文件的函数, 而不是当前这个实例方法

### 修改 toString()
3 1130
```js
toString() {
    const classname = this.constructor.name
    console.log('debug classname', classname)
    const keys = Object.keys(this)
    const properties = keys.map((k) => {
        const v = this[k]
        const s = `${k}: (${v})`
        return s
    }).join('\n  ')
    const s = `< ${classname}: \n  ${properties}\n>\n`
    return s
}
```
当我们调用 console.log(a) 的时候, 实际上发生的是
var s = a.toString()
console.log(s)
有时候为了自定义显示的形式, 需要重写 toString 方法
比如 object.toString() 返回的是[object Object]
这显然不是我们需要的显示形式
我们在下面定义了两个 toString 方法, 第一个用来演示如何 debug
第二个直接使用
```js
toString() {
    const s = JSON.stringify(this, null, 2)
    return s
}
```

# 实际的数据处理
以下两个类用于实际的数据处理
因为继承了 Model 类
所以可以直接 save load

## User 类
```js
class User extends Model {
    constructor(form={}) {
        super()
        this.username = form.username || ''
        this.password = form.password || ''
    }

    validateLogin() {
        log(this, this.username, this.password)
        return this.username === 'gua' && this.password === '123'
    }

    validateRegister() {
        return this.username.length > 2 && this.password.length > 2
    }
}
```

###  子类的构造函数
```js
constructor(form={}) {
    super()
    this.username = form.username || ''
    this.password = form.password || ''
}
```
`super()` 继承父类构造函数
必须调用 super 方法, 才可以使用 this, 这里的 super 就是套路

```js
this.username = form.username || ''
this.password = form.password || ''
```
User 类定义两个属性



## 数据处理相关
与逻辑相关的数据操作都写在类中, 这样我们的路由处理的逻辑就会比较简单
路由那部分是 controller, 按照这样的方式组织代码
会出现 胖 model, 瘦 controller 的情况, 这个也是我们提倡的

## 校验登录的逻辑
```js
validateLogin() {
    log(this, this.username, this.password)
    return this.username === 'gua' && this.password === '123'
}
```
```js
    const us = User.all()
    for (let i = 0; i < us.length; i++) {
        const user = us[i]
        if (u.username === user.username && u.password === user.password) {

        }
    }
```
## 校验注册的逻辑
```js
validateRegister() {
    return this.username.length > 2 && this.password.length > 2
}
```
```js
class Message extends Model {
    constructor(form={}) {
        super()
        this.author = form.author || ''
        this.content = form.content || ''
        this.extra = 'extra message'
    }
}
```

## 暴露(导出)
这次暴露的是一个包含两个 model 的对象
```js
module.exports = {
    User: User,
    Message: Message,
}
```

# Request
```
class Request {

    constructor() {
        this.raw = ''
        this.method = 'GET'
        this.path = ''
        this.query = {}
        this.body = ''
    }

    form() {
        const body = decodeURIComponent(this.body)
        const pairs = body.split('&')
        const d = {}
        for (let pair of pairs) {
            const [k, v] = pair.split('=')
            d[k] = v
        }
        return d
    }
}

module.exports = Request

```

## 变量解释

| 变量     | 翻译   | 备注                                 |
| ------ | ---- | ---------------------------------- |
| raw    | 原始信息 | 请求 / 响应的原始信息                       |
| method | 请求方法 | get/post 等                         |
| path   | 路由   |                                    |
| query  |      | 路由 `?` 之后, 由 `=` `&` 分隔的数据, get 请求 |
| form   | 表单   | 由 `=` `&` 分隔的数据, post 请求, body 中   |
| body   |      | 请求的 form, 响应的网页等                   |

## 默认数据
```js
constructor() {
    this.raw = ''
    this.method = 'GET'
    this.path = ''
    this.query = {}
    this.body = ''
}
```
默认是 GET 方法
query 默认是一个 object, 这样使用会更加方便
构造器函数, 套路写法, 这个函数里声明了我们需要保存哪些属性
一般来说, 请求的原始信息, 请求方法, 请求路径, query 参数 和 body 参数都是重要的数据
所以我们这里直接保存了这几个信息

使用 get 方法提交的数据会放在 path 中
比如 GET /top250?start=25&filter= HTTP/1.1

## 解析表单
```js
form() {
    const body = decodeURIComponent(this.body)
    const pairs = body.split('&')
    const d = {}
    for (let pair of pairs) {
        const [k, v] = pair.split('=')
        d[k] = v
    }
    return d
}
```

封装一个 form 方法, 直接获取解析之后的数据(以 object 的形式)
一般使用 post 方法提交的数据会放在 request body 中
`decodeURIComponent(this.body)`
浏览器在发送 form 表单的数据时, 会自动使用 encodeURIComponent 编码
所以拿到 body 的数据之后先解码
得到的是下面这种格式的数据: a=b&c=d&e=f
解析成 object 的形式

{
    a: 'b',
    c: 'd',
    e: 'f',
}

# routes.js
2 3613
## code
```js
const fs = require('fs')
const log = require('./utils')

const models = require('./models')
const User = models.User
const Message = models.Message

const messageList = []


const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}


const index = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = template('index.html')
    const r = header + '\r\n' + body
    return r
}


const login = (request) => {
    let result
    log('debug request method', request.method)
    if (request.method !== 'POST') {

        const form = request.query

        const u = User.create(form)

        if (u.validateLogin()) {
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('login.html')


    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}


const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateRegister()) {

            u.save()
            const us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名或者密码长度必须大于2'
        }
    } else {
        result = ''
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('register.html')
    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}


const message = (request) => {
    if (request.method === 'POST') {
        console.log('看看数据有没有收到')
        const form = request.form()
        console.log('看看有没有拿到 form', form)
        const m = Message.create(form)
        log('debug post', form, m)
        m.save()

    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('message.html')
    const ms = Message.all()
    console.log('所有 message 消息', ms)
    body = body.replace('{{messages}}', ms)
    console.log('replace 之后的 body', body)
    const r = header + '\r\n' + body
    return r
}


const static = (request) => {

    const filename = request.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}


const routeMapper = {
    '/': index,
    '/static': static,
    '/login': login,
    '/register': register,
    '/message': message,
}

module.exports = routeMapper
```
## 暴露 routeMapper
把 route 放在一起, 然后暴露出去
匹配 path 对应的响应函数
```js
const routeMapper = {
    '/': index,
    '/static': static,
    '/login': login,
    '/register': register,
    '/message': message,
}

module.exports = routeMapper
```

## 引入 Model 模块
因为暴露出来的模块就是包含了 Model 的对象
所以分别将这个对象的属性提取出来赋值给相应的 model
```
const models = require('./models')
const User = models.User
const Message = models.Message
```
使用一个全局变量来暂时保存 message 信息
```
const messageList = []
```

## 读取 html 文件的函数
这样我们可以把页面的内容写入到 html 文件中, 专注处理逻辑
```
const template = (name) => {
    const path = 'templates/' + name
    const options = {
        encoding: 'utf8'
    }
    const content = fs.readFileSync(path, options)
    return content
}
```
## 主页的处理函数
返回主页的响应
请求的原文, path 是 /
/*
 GET / HTTP/1.1
 Host: 127.0.0.1:5000
 */
```
const index = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = template('index.html')
    const r = header + '\r\n' + body
    return r
}
```

## 登录的处理函数
根据请求方法来处理业务
请求原始信息, path 是 /login

/*
GET /login HTTP/1.1
Host: 127.0.0.1:5000
*/


```const login = (request) =&gt; {
    let result
    log('debug request method', request.method)
    if (request.method !== 'POST') {

        const form = request.query

        const u = User.create(form)
        if (u.validateLogin()) {
            result = '登录成功'
        } else {
            result = '用户名或者密码错误'
        }
    } else {
        result = ''
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('login.html')
    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}
```

获取表单中的数据
`const form = request.query`
根据 form 生成 User 实例
`const u = User.create(form)`
如果不把 validateLogin 方法提取出去, 那就需要像下面这种形式写代码
`if (u.username === 'gua' && u.password === '123') {}`

使用{{label}} 在页面里做一个记号, 直接替换掉这部分内容
这里的 {{}} 是自己约定的, 完全可以换成其他的形式, 比如 <<>>, >_<result>_<
`body = body.replace('{{result}}', result)`

## 注册的处理函数

```
const register = (request) => {
    let result
    if (request.method === 'POST') {
        const form = request.form()
        const u = User.create(form)
        if (u.validateRegister()) {
            u.save()
            const us = User.all()
            result = `注册成功<br><pre>${us}</pre>`
        } else {
            result = '用户名或者密码长度必须大于2'
        }
    } else {
        result = ''
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('register.html')
    body = body.replace('{{result}}', result)
    const r = header + '\r\n' + body
    return r
}
```

如果 u 这个实例符合注册条件, 就调用 save 函数, 将这个 u 保存到文件中

##　留言板的处理函数, 返回留言板的响应
```
const message = (request) => {
    if (request.method === 'POST') {
        console.log('看看数据有没有收到')
        const form = request.form()
        console.log('看看有没有拿到 form', form)
        const m = Message.create(form)
        log('debug post', form, m)
        m.save()
messageList.push(m)
    }
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    let body = template('message.html')
    const ms = Message.all()
    console.log('所有 message 消息', ms)
    body = body.replace('{{messages}}', ms)
    console.log('replace 之后的 body', body)
    const r = header + '\r\n' + body
    return r
}
```

图片的响应函数, 读取图片并生成响应返回
```
const static = (request) => {
静态资源的处理, 读取图片并生成相应返回
    const filename = request.query.file || 'doge.gif'
    const path = `static/${filename}`
    const body = fs.readFileSync(path)
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}
```

webstorm 中双击 shift 键(也就是按两下)会弹出一个窗口,
可以快速定位到文件的位置





# server.js

## code
```js
const net = require('net')
const fs = require('fs')

const Request = require('./request')
const routeMapper = require('./routes')
const log = require('./utils')

const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
    return r
}

const parsedPath = (path) => {
    const index = path.indexOf('?')
    if (index === -1) {
        return {
            path: path,
            query: {},
        }
    } else {
        const l = path.split('?')
        path = l[0]

        const search = l[1]
        const args = search.split('&')
        const query = {}
        for (let arg of args) {
            const [k, v] = arg.split('=')
            query[k] = v
        }
        return {
            path: path,
            query: query,
        }
    }
}


const responseFor = (r, request) => {
    const raw = r
    const raws = raw.split(' ')

    request.raw = r
    request.method = raws[0]
    let pathname = raws[1]
    let { path, query } = parsedPath(pathname)
    request.path = path
    request.query = query
    request.body = raw.split('\r\n\r\n')[1]
    log('path and query', path, query)

    const route = {}
    const routes = Object.assign(route, routeMapper)
    const response = routes[path] || error
    const resp = response(request)
    return resp
}

const run = (host='', port=3000) => {
    const server = new net.Server()

    server.listen(port, host, () => {
        const address = server.address()
        log(`listening server at http://${address.address}:${address.port}`)
    })

    server.on('connection', (s) => {
        s.on('data', (data) => {
            const request = new Request()
            const r = data.toString('utf8')
            const ip = s.localAddress
            log(`ip and request, ${ip}\n${r}`)

            const response = responseFor(r, request)

            s.write(response)
            s.destroy()
        })
    })

    server.on('error', (error) => {
        log('server error', error)
    })

    server.on('close', () => {
        log('server closed')
    })
}

const __main = () => {
    run('127.0.0.1', 5000)
}

__main()
```
## 引入内置模块
```
const net = require('net')
const fs = require('fs')
```

## 引入自定义模块
```
const Request = require('./request')
const routeMapper = require('./routes')
const log = require('./utils')
```
Request 是 封装了请求的类
routeMapper 是路由 object

## 解析 path 的函数
path 可能的取值
/home
/message?content=hello&author=gua
返回包含 path 和 query 的 object
const parsedPath = (path) => {
      content=hello&author=gua
      {
          'message': 'hello',
          'author': 'gua',
      }
    先判断 path 中是否包含 ?
    const index = path.indexOf('?')
    如果不包含 ?, query 是一个空对象
    if (index === -1) {
        return {
            path: path,
            query: {},
        }
    } else {
        如果包含 ?, 则按照 ? 将请求中的 path 分成 path 和 query
        const l = path.split('?')
        path = l[0]
    
        下面这部分的作用是解析 query
        query 的格式为 a=b&c=d&e=f
        const search = l[1]
        const args = search.split('&')
        const query = {}
        for (let arg of args) {
            const [k, v] = arg.split('=')
            query[k] = v
        }
        return {
            path: path,
            query: query,
        }
    }
}


## request 对应的响应函数
```js
const responseFor = (r, request) => {
    const raw = r
    const raws = raw.split(' ')
    request.raw = r
    request.method = raws[0]
    let pathname = raws[1]
    let { path, query } = parsedPath(pathname)
    request.path = path
    request.query = query
    request.body = raw.split('\r\n\r\n')[1]
    log('path and query', path, query)
    const route = {}
    const routes = Object.assign(route, routeMapper)
    const response = routes[path] || error
    const resp = response(request)
    return resp
}
```
request 是自定义的对象, 我们使用这个对象来保存请求的相关信息
比如 method, path, query, body


定义一个基本的 route, 是一个空 object
然后将引入进来的 routeMapper 与空 object: route 合并
`Object.assign(o1,o2[,...objects])` 合并多个 object, 并返回

### 获取 response 函数
```js
const response = routes[path] || error
const resp = response(request)
```
将 request 作为 response 的参数传出去, 这样每一个 response 都可以与对应的 request 挂钩
