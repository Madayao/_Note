const log = (...args) => {
    console.log.apply(console, args)
}


// 1.
// ---------------------------------------------------------------------------------------------------------------------
function foo(x) {
    var tmp = 3;
    var t = 3
    log('t', t, t++, t, ++t, t)
    return function (y) {
        all = x + y + (++tmp)
        log(all);
        log(`x${x} y${y} tmp${tmp} all${all}`)
    }
}
foo(2)
var bar = foo(2)
bar(10)
bar(10)

// 闭包的关键在于函数内的变量在函数内的函数里变动, 即关注于同时出现在内部函数内外的变量, 这个变量会积累变化 (个人看法)
// foo return 的函数要想成功执行就必须依赖上级变量 tmp (但是为什么不从 tmp = 3 开始呢???)


// 2.
// ---------------------------------------------------------------------------------------------------------------------
function fun(n,o) {
    console.log(o)
    return {
        fun:function(m){
            return fun(m,n);
        }
    };
}
var a = fun(0);  a.fun(1);  a.fun(2);  a.fun(3);
var b = fun(0).fun(1).fun(2).fun(3);
var c = fun(0).fun(1);  c.fun(2);  c.fun(3);


function g(b,a) {
    log(a)
    return {
        f:function(c){
            return g(c,b);
        }
    };
}
// x = g(0);  x.f(1);  x.f(2);  x.f(3);
// y = g(0).f(1).f(2).f(3);
// z = g(0).f(1);  z.f(2);  z.f(3)

log('---a1')
x = g(0);  x.f(1);  x.f(2);  x.f(3);
log('---a2')
x = g(0);  g(0).f(1);  g(0).f(2);  g(0).f(3);
log('---b1')
y = g(0).f(1).f(2).f(3);
log('---c1')
z = g(0).f(1);  z.f(2);  z.f(3)
log('---c2')
z = g(0).f(1);  g(0).f(1).f(2);  g(0).f(1).f(3)


// . 后面只可能是对象内的函数
// 显然 '直接调用函数' 和 '用变量接下函数的调用' 区别在于前者会调用函数, 后者只是一个值 ...废话, 其实我是指 c2.f(2) 和 g(0).f(1).f(2) 的区别
// 调用函数要考虑函数的执行结果是不是完成, 比如 g(3,2) 就没有, 还是一个调用, 要考虑其结果, 不要遗漏

// x >>> g(0,u) >>> log(u); {f:function(c){return g(c,0)}
// x.f(1) >>> function(1){return g(1,0)} >>> g(1,0) >>> log(0); {f:function(c){return g(c,1)}
// x.f(n) >>> log(0); {f:function(c){return g(c,n)}

// y >>> g(0,u).f(1).f(2).f(3)
// log(u); {f:function(c){return g(c,0)}.f(1).f(2).f(3) >>> function(1){return g(1,0)}.f(2).f(3) >>> g(1,0).f(2).f(3)
// log(0); g(2,1).f(3)
// log(1); g(3,2)
// log(2);

// z >>> g(0,u).f(1) >>> log(u);g(1,0) >>> log(1);{f:function(c){return g(c,1)}}
// z.f(2) >>> g(2,1) >>> log(1);{f:function(c){return g(c,2)}}
// z.f(3) >>> g(3,1) >>> log(1);{f:function(c){return g(c,3)}}

function g(b,a) {
    log(a)
    f = function(c){
        return g(c,b);
    }
    o = {f}
    return o
}

// g(b,a) >>> log(a); o
// g(b,a).f(c) >>> log(a); o.f(c) >>> log(a); g(c,b) >>> log(a); log(b); o


// 3.
// ---------------------------------------------------------------------------------------------------------------------
var name = 'global';
var obj = {
    name : 'obj',
    dose : function(){
        this.name = 'dose';
        return function(){
            return this.name;
        }
    }
}
// alert(obj.dose().call(this))


// call(this) 相当于将函数运行环境中的 this 对象替换成 window,
//

// 变体
var name = 'global';
var obj = {
    name : 'obj',
    dose : function(){
        this.name = 'dose';
        return function(){
            return this.name;
        }.bind(this)
    }
}
// alert(obj.dose().call(this))
// bind 绑定 this 为 dose
// dose

// 变体 2
var name = 'global';
var obj = {
    name : 'obj',
    dose : function(){
        var that = this;
        this.name = 'dose';
        return function(){
            return that.name;
        }
    }
}
// alert(obj.dose().call(this))
// 这里 that 是 dose
// dose




// 4.
// ---------------------------------------------------------------------------------------------------------------------
for (var i = 1; i <= 1; i++) {
    setTimeout( function timer() {
        console.log(`延时 1001 最靠前的代码, 但延时最长, 猜测是同时开始计算延时的  1-${i}`,i);
    }, 1001 );
}
console.log('无延时 1',i)

// 这跟闭包有关系???
// 相当于

var i = 1
for (i ; i <= 50000; i++) {
    setTimeout( function timer() {
        console.log(`延时 900 2-${i}`,i);
    }, 900 );
}
console.log('无延时 2',i)
// 下面考虑 ++i

for (var i = 1; i <= 2; ++i) {
        console.log(`无延时 3-${i}`,i)
}
console.log('无延时 3',i)

// 所以是执行顺序, setTimeout 内的 i 要在函数全部运行之后才执行, 这时 i 为 6
// 注意执行时间的差异, 900 和 1000, 哪怕只有一个操作, 也是 900 先运行
var i = 100
// 此时 i 为 100

for (let i = 1; i <= 2; i++) {
    setTimeout( function timer() {
        console.log(`延时 950 let-${i}`,i);
    }, 950 );
}
// let 的作用域在 {} 内

let j = 1
for (j; j <= 2; j++) {
    setTimeout( function timer() {
        console.log(`延时 950 let-j-${j}`,j);
    }, 950 );
}
// 这里的 j 是外部的 j

for (var i = 1; i <= 2; i++) {
    (function(i){
        setTimeout( function timer() {
            console.log('延时 1000 闭包 1',i);
        },  1000 );
    })(i);
}
console.log('无延时 闭包 1 外部');
(function(i){
    setTimeout( function timer() {
        console.log('延时 1000 闭包 1',i);
    },  1000 );
})(i);
// () 内的函数相当于下面的 f4, 匿名函数, 相当于循环 i, 并依次做为参数传入
for (var i = 1; i <= 2; i++) {
    var f4 = function(i){
        setTimeout( function timer() {
            console.log('延时 1000 闭包 2',i);
        },  1000 );
    }
    f4(i)
}
// 相当于 f4(1)f4(2)
console.log('无延时 直接调用函数, 此时没有值, 因为 setTimeout:', f4(10), f4(11))
console.log('无延时 for 外部 var, 此时 f4 可以调用:',f4)
f4(i)
// f4 可以引用, 因为使用 var 声明
for (var i = 1; i <= 2; i++) {
    let g4 = function(i){
        setTimeout( function timer() {
            console.log('延时 1000 闭包 2 let',i);
        },  1000 );
    }
    g4(i)
}
// console.log('for 外部 let ',g4)
// g4(i)
// 报错, 因为 g4 不在这一级作用域之上

// 5.
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------