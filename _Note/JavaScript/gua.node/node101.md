@(node.萧大)[node, server, client]
# node101
## 目录

[TOC]

## 知识点

# 预习
- 1-1 1330

http.js 是理论知识, 主要是讲 http 协议的, 之前课程上已经讲过, 所以大致看看, 顺便复习
client.js 是使用 node net 库进行网络编程, 实现 HTTP 客户端（比如浏览器）的程序
server.js 是使用 node net 库进行网络编程, 实现 HTTP 服务端的程序

其中 client.js 主要做了以下的事情
引入模块
配置参数
连接服务器
发送数据(往服务器)
接收数据
关闭客户端


server.js 主要做了以下的事情
引入一个模块（模块就是别人已经写好的代码，可以直接拿来使用）
配置相关参数
创建服务器
监听连接
接收数据
处理数据
发送数据
关闭服务器

- 1-1 1709

可以配合注释理解代码，有不理解的地方先记录下来就可以。
因为是新东西而且很抽象，所以有很多不理解的都很正常。
有很多都是套路写法，能有个大致的印象就可以。

# http 协议
## 网址组成
- 1-1 1840
  网址组成（四部分）
      协议      http, https（https 是加密的 http）
      主机      g.cn  zhihu.com之类的网址
      端口      HTTP 协议默认是 80，因此一般不用填写, https 默认 443
      路径      下面的「/」和「/question/31838184」都是路径, ? 之后是 query (?)
  http://www.zhihu.com/
  http://www.zhihu.com/question/31838184?name=gua


## ip 与 域名
2030
电脑通信靠 IP 地址，IP 地址记不住就发明了域名（domain name），
然后电脑自动向 DNS 服务器（domain name server）查询域名对应的 IP 地址

比如 g.cn 这样的网址，可以通过电脑的 ping 程序查出对应 IP 地址
➜  ~ ping g.cn
PING g.cn (218.205.104.41): 56 data bytes

### cmder 使用
2120

推荐 cmder 软件进行命令行操作

## 端口
2237

端口是什么？
一个比喻：
用邮局互相写信的时候，ip 相当于地址（也可以看做邮编，地址是域名）
端口是收信人姓名（因为一个地址比如公司、家只有一个地址，但是却可能有很多收信人）
端口就是一个标记收信人的数字。
端口是一个 16 位的数字，所以范围是 0-65535（2**16）


## http 协议
——HTTP协议——

一个传输协议，协议就是双方都遵守的规范。
为什么叫超文本传输协议呢，因为收发的是文本信息。
1，浏览器（客户端）按照规定的格式发送文本数据（请求）到服务器
2，服务器解析请求，按照规定的格式返回文本数据（响应）到浏览器
3，浏览器解析得到的数据，并做相应处理

请求和响应是一样的数据格式，分为 4 部分：
1，请求行或者响应行
2，Header（请求的 Header 中 Host 字段是必须的，其他都是可选）
3，\r\n\r\n（连续两个换行回车符，用来分隔 Header 和 Body）
4，Body（可选）

请求的格式，注意大小写（这是一个不包含 Body 的请求）：
原始数据如下
知乎首页的请求原始数据格式:
'GET / HTTP/1.1\r\nHost: www.zhihu.com\r\n\r\n'

我们看到的格式:
GET / HTTP/1.1
Host: www.zhihu.com


'GET / HTTP/1.1\r\nHost:g.cn\r\n\r\n'
打印出来如下
GET / HTTP/1.1
Host: g.cn

其中
1， GET 是请求方法（还有 POST 等，这就是个标志字符串而已）
2，/ 是请求的路径（这代表根路径）
3，HTTP/1.1 中，1.1 是版本号，通用了 20 年

具体字符串是 'GET / HTTP/1.1\r\nhost:g.cn\r\n\r\n'


返回的数据如下
HTTP/1.1 301 Moved Permanently
Alternate-Protocol: 80:quic,p=0,80:quic,p=0
Cache-Control: private, max-age=2592000
Content-Length: 218
Content-Type: text/html; charset=UTF-8
Date: Tue, 07 Jul 2015 02:57:59 GMT
Expires: Tue, 07 Jul 2015 02:57:59 GMT
Location: http://www.google.cn/
Server: gws
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block



Body 部分太长，先不贴了
其中响应行（第一行）：
1，HTTP/1.1 是版本
2，301 是「状态码」，参见文末链接
3，Moved Permanently 是状态码的描述
浏览器会自己解析 Header 部分，然后将 Body 显示成网页



——web 服务器做什么——

主要就是解析请求，发送相应的数据给客户端。
例如附件中的代码（client.js）就是模拟浏览器发送 HTTP 请求给服务器
并把收到的所有信息打印出来（使用的是最底层的 socket，
现阶段不必关心这种低层，web 开发是上层开发）



# server 服务器
- 2-2 0128

## code
```js
const net = require('net')

const host = ''
const port = 2000

const server = new net.Server()

server.listen(port, host, () => {
    console.log('listening.', server.address())
})

server.on('connection', (socket) => {
    const address = socket.remoteAddress
    const port = socket.remotePort
    const family = socket.remoteFamily
    console.log('connected client info', address, port, family)
    socket.on('data', (foo) => {
        const r = foo.toString()
        console.log('接受到的原始数据', r, typeof(r))
        const response = 'HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello world!'
        socket.write(response)
    })
})


server.on('error', (error) => {
    console.log('server error', error)
})

server.on('close', () => {
    console.log('server closed')
})

```
## 引入模块
引入一个模块, 会在下面用到
模块就是别人已经写好的程序, 我们可以直接拿来使用
```js
const net = require('net')
```


## 配置服务器的参数
服务器的 host 为空字符串, 表示接受任意 ip 地址的连接
port 是端口, 这里设置的是 2000
随便选一个 1024 - 65535 之间的数字就可以, 1024 以下的端口需要管理员权限才能使用
```js
const host = ''
const port = 2000
```


## 创建一个服务器
套路
相当于 new 一个对象
```js
const server = new net.Server()
```


##　监听连接
0607

这里打印出来的 ipv6 的格式, 端口是 2000
`server.listen(port, host, callback)` 监听
`server.address()` 返回的是绑定的服务器的 ip 地址、ip 协议、端口号
```js
server.listen(port, host, () => {
    server.address()
    console.log('listening.', server.address())
})
```

##  触发连接

`server.on('connection', callback)` 当有新连接建立时, 就会触发 connection 事件

类似于 click 事件等
socket 是回调函数的参数, 在这里是一个套路

socket.io 是对 websocket 的封装

```js
server.on('connection', (socket) => {

}
```

### socket 属性

客户端信息的属性

`socket.remoteAddress` 远程ip 地址
`socket.remotePort` 远程端口, 操作系统分配给客户端的端口
`socket.remoteFamily` 远程协议族

```js
    const address = socket.remoteAddress
    const port = socket.remotePort
    const family = socket.remoteFamily
    console.log('connected client info', address, port, family)
```

## 接收数据

```js
    socket.on('data', (data) => {
        const r = foo.toString()
        console.log('接受到的原始数据', r, typeof(r))

        const response = 'HTTP/1.1 200 OK\r\nContent-Length: 12\r\n\r\nHello world!'
        socket.write(response)

        socket.destroy()
    })
})
```

`socket.on('data', callback(data))` 当 socket 接收到数据的时候, 会触发 data 事件
第一个 data 是事件名称,
第二个 data 是参数
参数 data 是一个 Buffer 类型
Buffer 是 node 中的特殊类型, 用来处理二进制数据

`buffer.toString()` 将二进制数据 buffer 转成字符串

## 发送数据
`socket.write(response)` 发送数据, 参数是 string 或 buffer 都可以

## 结束连接
`socket.destroy()` 结束连接(?), 表示数据传送完毕(?), 表示当前请求以结束
`Content-Length: 12` 在 header 中声明数据长度
需要使用以上两种方式告知浏览器当前请求已经结束
否则会出现一直等待的情况, 也就是会一直 loading
套路

## 末尾套路

### 服务器出错
`server.on('error', callback(error))` 服务器出错的时候会触发这个事件, 但是具体什么出错是未知的
```js
server.on('error', (error) => {
    console.log('server error', error)
})
```

### 服务器关闭
`server.on('close', callback)` 当服务器关闭时被触发
```js
server.on('close', () => {
    console.log('server closed')
})
```


# client 客户端
1-1 2535

## code
```js
const net = require('net')
const tls = require('tls')

const host = '59.111.160.197'
const port = 80

const client = new net.Socket()
const client_tls = new tls.TLSSocket()

client.connect(port, host, () => {
    console.log('connect to: ', host, port)

    const request = 'GET / HTTP/1.1\r\nHost: music.163.com\r\n\r\n'
    client.write(request)

})

client.on('data', (d) => {
    console.log('data:', d.toString())

    client.destroy()
})

client.on('close', function() {
    console.log('connection closed')
})
```

## 引入一个模块
```js
const net = require('net')
const tls = require('tls')
```
net 用于 http
tls 用于 https

## 设置
设置连接服务器的信息, 也就是指定服务器的地址和端口
实际上这个是服务器告诉给客户端的信息
0.0.0.0 在 windows 下面会报错, 所以换成 127.0.0.1
mac 上面可以使用 0.0.0.0

host 可以填写 ip  或 域名(不含 http:// )
```js
const host = '59.111.160.197'
const port = 80
```
## 创建一个客户端
可以连接到服务器
```js
const client = new net.Socket()
const client_tls = new tls.TLSSocket()
```
`const client = new net.Socket()` 创建 http 连接的客户端
`const client_tls = new tls.TLSSocket()` | 创建 https 连接的客户端

## 连接服务器

```js
client.connect(port, host, () => {
    console.log('connect to: ', host, port)
    const request = 'GET / HTTP/1.1\r\nHost: music.163.com\r\n\r\n'
    client.write(request)
})
```
### 连接服务器
`client.connect(port, host, callback)` 客户端根据给出的配置参数打开一个连接, 连接到服务器

### 发送数据
`client.write(request)` 向服务器发送一个消息, server destroy 之后调用会报错

## 接收数据
当接收服务器的响应数据时触发 data 事件
其实这里就是接收服务器的数据
```js
client.on('data', (d) => {
    console.log('data:', d.toString())
    client.destroy()
})
```
### 接收数据
`client.on('data', callback(data))` 当接收服务器的响应数据时触发 data 事件
其实这里就是接收服务器的数据
默认 data 是 buffer 类型, 使用 `buffer.toString()` 转换

### 关闭连接
`client.destroy()` 完全关闭 client 的连接, 套路写法

## 结尾套路
```js
client.on('close', function() {
    console.log('connection closed')
})
```
### 关闭事件
`client.on('close', callback())` client 关闭的时候触发这个事件

# 模拟浏览器和服务器
1-3
关键是请求和响应, 要符合格式, 参照 http 协议
