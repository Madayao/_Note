@(git)[git, command]

# Git 简要使用

## 目录

[TOC]

# Code Table

| s         |                    |                        |
| --------- | ------------------ | ---------------------- |
| status    | 查看当前工作目录下的文件状态     | git status             |
| diff      | 查看更改的内容            | git status             |
| add       | 跟踪一个文件             | git add .[文件名]         |
| commit    | 提交更新到本地仓库          | git commit -m "update" |
| push      | 推送到远程仓库            | git push origin master |
| branch    | 新建一个分支             | git branch [分支名]       |
| checkout  | 切换到分支              | git checkout [分支名]     |
| merge     | 将指定分支合并到当前工作分支中    | git merge [分支名]        |
| branch -d | 删除指定分支             | git branch -d [分支名]    |
| pull      | 从远程获取最新版本并merge到本地 | git pull origin master |
|           |                    |                        |
|           |                    |                        |
|           |                    |                        |
|           |                    |                        |



# 流程
修改提交
```
git add .
git commit -m update
git push origin master
```
下载 变更
```
git fetch origin master
git diff tmp 
git merge tmp
git pull origin master
```


## 初始化新仓库

**到所在的目录** 后执行：

```
git init
```

在当前文件夹中会出现一个 .git 文件夹。所有 Git 需要的数据和资源都存放在这个目录中。



## 添加远程仓库

```
git remote add
```



## 克隆远程仓库

```
git clone
```

git clone + 仓库地址



## 查看当前的远程仓库

```
git remote -v
```



## 抓取到本地

```
git fetch
```

  git fetch + 仓库名



## 推送到远程仓库

一般远程仓库名为 origin

```
git add *
git commit -m update
git push origin master
```


## 生成公钥

```
ssh-keygen -t rsa -C yg_yao@163.com
```


ssh-keygen -t rsa -C + 邮箱

接下来选择配置, 可以都回车, 使用默认地址和方式保存



```
cd
cd .ssh
cat id_rsa.pub
```


打开 id_rsa.pub 文件, 复制公钥

Windows 下查看保存位置打开复制
