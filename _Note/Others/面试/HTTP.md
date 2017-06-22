@(HTTP)[node, http]

# HTTP 协议

# Request

```
GET /login HTTP/1.1
Host: 127.0.0.1:5000
Connection: keep-alive
Upgrade-Insecure-Requests: 1
User-Agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.81 Safari/537.36
Accept: text/html,application/xhtml+xml,application/xml;q=0.9,image/webp
Referer: http://127.0.0.1:5000/
Accept-Encoding: gzip, deflate, sdch, br
Accept-Language: zh-CN,zh;q=0.8
Cookie: session=lsfjlspdfjsfjsladfweorijklj3l2k4j2l3k4jlk234j23l4jlkhdf90gf0-h.dfsf


```



```
请求方法 路由 协议版本\r\n (这一行是请求行
请求头\r\n
\r\n
body
```

# Response

```
HTTP/1.1 200 OK
Server: nginx/1.10.0 (Ubuntu)
Date: Wed, 31 May 2017 02:44:14 GMT
Content-Type: text/html; charset=utf-8
Transfer-Encoding: chunked
Connection: keep-alive
Set-Cookie: session=eyJfcGVybWFuZW50Ijp0cnVlLCJ1c2VybmFtZSI6Ikd5b25HeW9uIn0.DA-_fg.3hsMMIGvwSmhkfi7ZNpHZg04I00; Expires=Sat, 01-Jul-2017 02:44:14 GMT; HttpOnly; Path=/
Content-Encoding: gzip
```

```
协议版本 状态码 OK\r\n (这一行是响应行
响应头\r\n
\r\n
body
```



# Path

```
http://www.zhihu.com/question/31838184?name=gua
```

```
协议://主机:端口/路由(?query)
```
# Headers

| 代码                      | 解释         | 实例   |
| ----------------------- | ---------- | ---- |
| `Content-Type:`         | 声明 body 类型 |      |
| `Content-Length:`       | 声明 body 长度 |      |
| `Content-Type:charset=` | 声明 body 编码 |      |



# 变量解释

| 变量     | 翻译   | 备注                                   |
| ------ | ---- | ------------------------------------ |
| raw    | 原始信息 | 请求 / 响应的原始信息                         |
| method | 请求方法 | get/post 等                           |
| path   | 路由   | `?` 之后, 由 `=` `&` 分隔的数据是 get 请求      |
| query  | 请求数据 | get 在 path 中, post 在 body 中          |
| body   |      | 请求的 form 数据, 响应的网页等                  |
| form   | 表单   | 由 `=` `&` 分隔的数据, 常在 body 中, post 请求, |
