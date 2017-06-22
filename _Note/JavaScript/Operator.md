

@(JavaScript)[JS,语句]

# JavaScript 运算符

| 语法                                      | 名称                                       | 解释                                       | 例                                    |
| --------------------------------------- | ---------------------------------------- | ---------------------------------------- | ------------------------------------ |
| `condition ? expression1 : expression2` | 条件（三元）运算符                                | 如果 condition 为真返回,  expr1, 否则返回 expr2    | `max = a > b ? a : b`                |
| `condition || expression`               | 逻辑或短路计算                                  | 如果 expr1为真, 返回 expr1, 否则返回 expr2; 当条件运算符的 condition 可以被 expr1 代替时, 两者可相互 | `doSomething() || doSomethingElse()` |
| `condition && expression`               | 逻辑与短路计算                                  | 如果 expr1为假, 返回 expr1, 否则返回 expr2         | `doSomething() && doSomethingElse()` |
| `object1 = object2`                     | [解构赋值](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Operators/Destructuring_assignment) | 将 obj2 的值依次赋值给 obj1 的变量(个人理解)            | `var [a,,b=2] = fuc()`               |



# 参数解释

| 参数         | 描述                  |
| ---------- | ------------------- |
| object     | 一个对象                |
| condition  | 计算结果为true或false的表达式 |
| expression | 值可以是任何类型的表达式        |
|            |                     |
|            |                     |
|            |                     |
|            |                     |
|            |                     |
|            |                     |
|            |                     |