num = 0
o = {}
o.b = {}
o.num = 1

o.b.num = 2

f = function () {
    console.log(this.num)
}
o.f = f
o.b.f = f
f()
o.f()
o.b.f()

o.foo = function () {
    console.log(this.num)
}
o.b.foo = function () {
    console.log(this.num)
}
o.foo()
o.b.foo()
