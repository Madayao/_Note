    

@(Linux)[Linux, command]

# Linux 常用操作与配置
## 目录
    
[TOC]

# 重启服务器后操作
```
ssserver -c /etc/shadowsocks.json -d start
cd index
node app.js &
```

# 我的网站

删除 安装 配置 启动
```
cd ~/
rm -r index
git clone git@git.coding.net:Gyon/index.git
cd index
yarn
node app.js &
```
# yarn
安装
```
curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt-get update && sudo apt-get install yarn
```

# 防火墙
安装 配置 启动
```
apt-get install ufw
ufw allow 22
ufw allow 80
ufw allow 443
ufw allow 8388
ufw default deny incoming
ufw default allow outgoing
ufw status verbose
ufw enable

```

# [Shadowsocks](http://www.jianshu.com/p/b5c4fbadbfae)
安装 配置
```
apt-get update
apt-get install python-pip
pip install setuptools
pip install shadowsocks
nano /etc/shadowsocks.json
```
写入 shadowsocks.json
```
{
 "server": "服务器 ip",
 "server_port": 8388,
 "local_address": "127.0.0.1",
 "local_port": 1080,
 "password": "password",
 "method": "aes-256-cfb",
 "fast_open": true,
 "timeout":300
}
```
启动
```
ssserver -c /etc/shadowsocks.json -d start
```
停止
```
ssserver -c /etc/shadowsocks.json -d stop
```
