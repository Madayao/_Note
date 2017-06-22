@(JS.Library)[JS,Library,JQuery]

# JQuery 常用方法
----

## 目录

[TOC]


## 简介

jQuery 是一个曾经最流行的前端库
还有很多衍生的库/插件比如 jQuery UI
链式调用

## 引入

可省略协议, 表示这是自适应协议

`<script src="http://cdn.bootcss.com/jquery/3.2.1/jquery.js"></script>`

## 选择器
1. 普通选择器
2. find
3. siblings
4. closest, parent

## dom 操作
1. append
2. remove
3. empty
4. show, hide, toggle

## class 操作
1. addClass removeClass
2. toggleClass

## 属性、特性操作
1. attr, prop, data
    prop 用于 true false 这样的布尔值属性
2. removeAttr

## 取值
1. val() 相当于 .value
2. text() 相当于 .innerText
3. html() 相当于 .innerHTML

## 事件
1. on
2. event.target

## 数组方法
1. each
2. map

## ajax
1. contentType, dataType
