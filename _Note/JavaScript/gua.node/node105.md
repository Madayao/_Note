@(后端.萧大)[node]
# node
----
## 目录

[TOC]

## 知识点

# 预习
- 1 0205
db 文件夹 存放数据库文件
models 文件夹 存放数据
routes 文件夹 存放路由
static 文件夹 存放静态资源
templates 文件夹 存放页面

server.js 改成 app.js, 惯用命名,
并且将一些处理 request 的函数提取到 Request 类中, 这样 app.js 就很精简
request.js 是处理 request 的类


本节课讲一个简单 todo 程序项目, 包含的文件如下
routes/todo.js 包含了项目的所有路由函数
显示所有todo
增加todo
更新todo
删除todo

models/todo.js 包含了 Todo Model, 用于处理数据

templates/todo_index.html
显示所有 todo 的页面
templates/todo_edit.html
显示编辑 todo 的界面 (现在是空白文件 上课会增加内容)

点击添加按钮增加一个新的 todo 的时候, 程序的流程如下(包含原始 HTTP 报文)
1, 浏览器提交一个表单给服务器(发送 POST 请求)
POST /todo/add HTTP/1.1
Content-Type: application/x-www-form-urlencoded

title=heuv
2, 服务器解析出表单的数据, 并且增加一条新数据, 并返回 302 响应
HTTP/1.1 302 REDIRECT
Location: /todo

3, 浏览器根据 302 中的地址, 自动发送了一条新的 GET 请求
GET /todo HTTP/1.1
Host: ....

4, 服务器给浏览器一个页面响应
HTTP/1.1 200 OK
Content-Type: text/html
Content-Length: ...

<html>
....
</html>
5, 浏览器把新的页面显示出来



把 TODO 改写为带用户功能的高级版(这部分上课讲)
涉及到不同数据的关联
关联数据在服务器/浏览器之间的传递


此外还会讲抓包软件 fiddler 的使用
持久化 session 和服务器 session 控制过期时间会放在数据加密那节课讲

# app.js

## main

```js
if (require.main === module) {
    __main()
}
```
app.js 的两种运行方式
1. 命令行 `node app.js`
2. node `require('./app.js')`

调用 main 函数
如果是使用 node app.js 的方式运行, 那么 require.main 就是 module (require.main === module, true)
否则不是(比如 const app = require('./app.js')
实际上这里就是一个套路, 排除了加载的情况
加载时, 仅仅是加载, 避免运行

# routes

## routes/main.js

### 生成头部
```js
const headerFromMapper = (mapper={}, code=200) => {
    let base = `HTTP/1.1 ${code} OK\r\n`
    const keys = Object.keys(mapper)
    const s = keys.map((k) => {
        const v = mapper[k]
        const h = `${k}: ${v}\r\n`
        return h
    }).join('')

    const header = base + s
    return header
}
```
通过头部组成的 mapper 生成请求头

### 重定向函数
```js

const redirect = (url) => {
    const headers = {
        Location: url,
    }
    const header = headerFromMapper(headers, 302)
    const r=  header + '\r\n' + ''
    return r
}
```
浏览器在收到 302 响应的时候
会自动在响应头里面找 Location 头部并获取一个 url
然后自动请求新的 url

# todo

## update
更新 todo 有三种方案
1. 主流的做法, 但是非常野鸡
```js
const id = form.id
const title = form.title
const t = Todo.get(id)
t.title = title
t.save()
```
更新每一个属性后获取 id 对应的 todo, 更改 title, 保存

2. 算是比较好的一个方式
```js
const id = Number(form.id)
const t = Todo.get(id)
t.update(form)
```
提取更新属性的方法

3. 目前来说最好的方式
```js
Todo.update(form)
```
```js
static update(form) {
    const id = Number(form.id)
    const t = this.get(id)
    t.title = form.title
    t.save()
}
```
提取更新这一整个方法

写程序应该写 what, 而不是写 how
我只要关心这里是更新 todo 这件事情就好了
怎么更新的我不用也不想关心
# 函数命名

回调函数中的参数命名可以省略为一个字母如 socket: s, event: e
外部函数尽量具体, 便于理解\调用
在类中的方法名前加 `_`, 是为了表明这是一个私有方法, 如: `_parsedRaw`

名词/形容词   返回
动词          执行

# 代码规范

写好代码要先自己测试, 自己先有底
