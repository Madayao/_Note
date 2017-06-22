@(node.萧大)[node, server, http]
# node102
## 目录

[TOC]

## 知识点

# 预习
1-1 0310
basic.html 是一个基本的 html 文件, 非常基础的内容, 直接看一下就可以了
doge.gif 是一张图片, 上课会用上
server.js 是一个基本的 web 后端框架

## 服务器逻辑
基本套路还是上节课提到的
引入一个模块（模块就是别人已经写好的代码，可以直接拿来使用）
配置相关参数
创建服务器
监听连接
接收数据
处理数据
发送数据
关闭服务器

## 服务器业务逻辑
作为 web 后端框架, 主要处理的是业务逻辑
也就是 接收数据 处理数据 发送数据
server.js 的处理流程如下
1. 获取请求的原始信息
2. 解析请求的 path
3. 根据 path 生成相应的响应
4. 返回响应信息




# server.js
## code
```js
const net = require('net')
const fs = require('fs')

const log = (...args) => {
    console.log.apply(console, args)
}



const routeIndex = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = '<h1>Hello World</h1><img src="doge.gif">'

    const r = header + '\r\n' + body
    return r
}

const routeHello = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html; charset=utf8\r\n'
    const body = '<head></head><body><h3>这个是对应 /hello 路由的 body</h3></body>'

    const r = header + '\r\n' + body
    return r
}

const routeImage = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'
    const file = 'doge.gif'
    const body = fs.readFileSync(file)
    log(body, body.toString())

    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}

const error = (code=404) => {

    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
    return r
}

const responseForPath = (path) => {
    const r = {
        '/': routeIndex,
        '/doge.gif': routeImage,
        '/hello': routeHello,
    }
    const resp = r[path] || error
    const response = resp()
    return response
}

const run = (host='', port=3000) => {
    const server = new net.Server()

    server.listen(port, host, () => {
        const address = server.address()
        console.log('listening.', address)
    })

    server.on('connection', (s) => {
        s.on('data', (data) => {
            const request = data.toString()
            const ip = s.localAddress
            log(`ip:${ip}\nrequest:\n---request start---\n${request}\n---request end---`)

            const method = request.split(' ')[0]
            log('method', method)

            const path = request.split(' ')[1]
            log('path', path)

            const response = responseForPath(path)
            log('debug response', response)

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
    run('127.0.0.1', 4000)
}

__main()
```

## 程序的入口
```js
const __main = () => {
    run('127.0.0.1', 4000)
    // run()
}
__main()
```
`__main()` 调用 main 函数

在 webstorm 中, 按住 Ctrl 之后, 点击函数名, 就会跳转到函数定义的地方

## 新的 log
因为 console.log 非常常用, 所以封装下, 方便之后扩展
需要注意的是箭头函数没有绑定 arguments, 所以直接使用 arguments 会报错
因此使用的是 es6 中的剩余参数(rest parameter), args 是一个数组
上面提到了 args 是一个数组, 所以这里直接用 apply
```js
const log = (...args) => {
    console.log.apply(console, args)
}
```

## 引入两个模块
```js
const net = require('net')
const fs = require('fs')
```

## 服务器主函数
1-1 1725
把逻辑放在单独的函数中, 这样可以方便地调用
指定了默认的 host 和 port, 因为用的是默认参数, 当然可以在调用的时候传其他的值

这部分函数可参照 node101 的 server.js
```js
const run = (host='', port=3000) => {
    const server = new net.Server()

    server.listen(port, host, () => {
        const address = server.address()
        console.log('listening.', address)
    })

    server.on('connection', (s) => {
        s.on('data', (data) => {
            const request = data.toString()
            const ip = s.localAddress
            log(`ip:${ip}\nrequest:\n---request start---\n${request}\n---request end---`)
            const method = request.split(' ')[0]
            const path = request.split(' ')[1]
            const response = responseForPath(path)
            log('debug response', response)
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
```
### 创建一个服务器
是套路写法
```js
const server = new net.Server()
```

### 监听连接
```js
    server.listen(port, host, () => {
        const address = server.address()
        console.log('listening.', address)
    })
```

### 触发连接
```js
server.on('connection', (s) => {

}
```
当有新连接建立时, 就会触发 connection 事件
可以想象网页里一个元素点击的时候, 就会触发 click 事件

### 接收数据
```js
s.on('data', (data) => {
}
```
当 socket(也就是这次的参数 s) 接收到数据的时候, 会触发 data 事件

### 处理数据
#### 解码 request
```js
    const request = data.toString()
    const ip = s.localAddress
```
`data.toString('utf8')` | 使用 toString 把 data 转成 utf8 编码的字符串
现在 request 是一个符合 http 请求格式的字符串:

#### http 请求格式
```
GET / HTTP/1.1
Host: localhost:4000
Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,;q=0.8
Accept-Encoding: gzip, deflate, sdch, br
Accept-Language: zh-CN,zh;q=0.8

```
把 request 转成字符串之后, 就可以很方便地解析了

#### 解析 path
```js
const path = request.split(' ')[1]
```
然后调用 responseForPath, 根据 path 生成响应内容

## 生成响应
根据 path 返回 response 的函数
```js
const responseForPath = (path) => {
    const r = {
        '/': routeIndex,
        '/doge.gif': routeImage,
        '/hello': routeHello,
    }
    // const resp = r[path] || error
    // const response = resp()
    // return response
    const response = r[path] || error
    return response()
}
```
把多个 path 放在一个 object, 同样是表驱动法
r 的 value 是一个函数
第一个请求的 path 是 /
第二个请求的 path 是 /doge.gif
path 为 '/' 时, r[path] 是 routeIndex
path 为 '/doge.gif' 时, r[path] 是 routeImage
path 不是 r 的 key 时, r[path] 是一个 undefined, response 就是 error
response 是对应的函数, 直接在 return 里调用, 返回相应的响应

### 主页请求的响应函数
返回主页的响应
```js
const routeIndex = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: text/html\r\n'
    const body = '<h1>Hello World</h1><img src="doge.gif">'
    // const header = `HTTP/1.1 200 OK\r\nContent-Type: text/html\r\nContent-Length: ${body.length}\r\n`
    const r = header + '\r\n' + body
    return r
}
```
提前写好符合 http 响应格式的字符串:

#### http 响应格式
```
HTTP 响应的格式
响应行 HTTP/1.1 200 OK
Header
\r\n\r\n
Body
```

#### 拼接响应数据
```js
const r = header + '\r\n' + body
```
拼接响应信息并返回, r 是字符串类型




### 图片请求的响应函数
`<img src="doge.gif">`body 中有一个 img 元素, 浏览器会发一个请求来获取 doge.gif
读取图片并生成响应返回
```js
const routeImage = () => {
    const header = 'HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\n\r\n'
    const file = 'doge.gif'
    const body = fs.readFileSync(file)
    const header = `HTTP/1.1 200 OK\r\nContent-Type: image/gif\r\nContent-Length: 3000\r\n\r\n`
    log(body, body.toString())
    const h = Buffer.from(header)
    const r = Buffer.concat([h, body])
    return r
}
```

#### 指定响应类型
`Content-Type: image/gif` | 指定响应类型为 gif 图片
图片的响应头部中 Content-Type 会指定返回的响应内容的类型
实际上只需要指定是 image 就可以了, 具体的类型是没有关系的
下载一般是 zip 文件

#### 读取文件
`fs.readFileSync(file[, encoding])` | 直接读取文件的内容, 默认返回 buffer 类型
所以 body 是 buffer
readFileSync 有第二个参数 encoding, 指定编码

#### 拼接数据
header 是 string, body 是 buffer
把 string 和 buffer 拼接起来

`Buffer.from(string)` | 将 string 数据转成 buffer 类型
`Buffer.concat([buf1, buf2])` | 将两个 buffer 拼接在一起
`buffer.byteLength` | buffer 类型数据的长度

### 错误请求的响应函数
如果变量 path 不是 r 的 key, r[path] 是一个 undefined,  此时 response 就是 error
```js
const error = (code=404) => {
    const e = {
        404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
    }
    const r = e[code] || ''
```
#### 默认参数
```js
const error = (code=404) => {}
```
这里使用了 es6 的默认参数, 即如果没有传 code, 那 code 取值 404

#### 表驱动法
```js
const e = {
    404: 'HTTP/1.1 404 NOT FOUND\r\n\r\n<h1>NOT FOUND</h1>',
}
```
将错误响应的信息放在一个 object(字典) 中, 方便处理
这个是表驱动法
404 对应的 value 也是一个 http 响应只不过这个响应没有 header


## 服务器主函数
### 发送数据
```js
s.write(response)
```
将 response 发送给客户端, 这里的客户端就是浏览器
`socket.write()` 可以接收 buffer 类型的参数
也就是说可以发送文本, 也可以发送像图片这样的二进制信息

### 结束连接
```js
s.destroy()
```
这里是一个套路, 如果不这么做, 浏览器不知道当前请求是否已经结束
会出现一直等待的情况, 也就是会一直 loading
上节课提到了除了调用 destroy 这种方式
还可以直接在 header 中指定 Content-Length

### 末尾套路
```js
server.on('error', (error) => {
    log('server error', error)
})
```
服务器出错的时候会触发这个事件, 但是具体什么出错是未知的, 套路写法
```js
server.on('close', () => {
    log('server closed')
})
```
当服务器关闭时被触发


# 其他
## if 语句的简单写法
```js
const r = e[code] || ''
```
如果 code 不在 e 这个 object 中, 就把响应设置成空字符串 ''
这样的代码不提倡, 但是业界的主流做法就是这样的, 我们要观察 模仿 学习 融入
上面的代码相当于下面的代码
把 5 行代码变成了 1 行, 因此会说比较简洁
```js
const r = e[code] ? e[code] : ''
```
```js
if (e[code]) {
    r = e[code]
} else {
    r = ''
}
```


## 编码问题
1. 在响应的 header 中声明 `Content-Type:charset=uft8`
2. 在 html 文件中 `<head><meta charset='uft-8'></head>`

## GET POST 区别

|        | GET                      | POST         |
| ------ | ------------------------ | ------------ |
| method | 'GET'                    | 'POST'       |
| 数据     | 请求头的 path 中, ? 之后的 query | body 中的 form |
|        |                          |              |

## 解析域名的 ip
1.
在 node.js 中
```js
const dns = require('dns')

const host = 'zhihu.com'

dns.lookup(host, (error, address, family) => {
    console.log('address and family', address, family)
})
```

2.
在 cmd 中`ping`

## 301 永久重定向
