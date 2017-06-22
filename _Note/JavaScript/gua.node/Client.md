 @(node)[后端,node, client]

# 客户端

| 代码                                       | 解释                                 | 实例   |
| ---------------------------------------- | ---------------------------------- | ---- |
| `const client = new net.Socket()`        | 创建 http 连接的客户端                     |      |
| `const client_tls = new tls.TLSSocket()` | 创建 https 连接的客户端                    |      |
| `client.connect(port, host, callback)`   | 客户端根据给出的配置参数打开一个连接, 连接到服务器         |      |
| `client.write(request)`                  | 向服务器发送一个消息, server destroy 之后调用会报错 |      |
| `client.on('data', callback(data))`      | 当接收服务器的响应数据时触发 data 事件             |      |
| `client.destroy()`                       | 完全关闭 client 的连接, 套路写法              |      |
| `client.on('close', callback())`         | client 关闭的时候触发这个事件                 |      |
