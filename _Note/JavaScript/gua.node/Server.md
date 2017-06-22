@(node)[后端,node, server]

# 服务器基本代码

| 代码                                    | 解释                              | 实例   |
| ------------------------------------- | ------------------------------- | ---- |
| `new net.Server()`                    | 创建服务器对象                         |      |
| `server.listen(port, host, callback)` | 监听连接                            |      |
| `server.address()`                    | 绑定的服务器的 ip 地址、ip 协议、端口号         |      |
| `server.on('connection', callback)`   | 当有新连接建立时, 就会触发 connection 事件    |      |
| `socket.remoteAddress`                | 远程ip 地址                         |      |
| `socket.remotePort`                   | 远程端口, 操作系统分配给客户端的端口             |      |
| `socket.remoteFamily`                 | 远程协议族                           |      |
| `socket.on('data', callback(data))`   | 当 socket 接收到数据的时候, 会触发 data 事件  |      |
| `socket.write(response)`              | 发送数据, 参数是 string 或 buffer 都可以   |      |
| `socket.destroy()`                    | 结束连接(?), 表示数据传送完毕(?), 表示当前请求以结束 |      |
| `server.on('error', callback(error))` | 服务器出错的时候会触发这个事件, 但是具体什么出错是未知的   |      |
| `server.on('close', callback)`        | 当服务器关闭时被触发                      |      |