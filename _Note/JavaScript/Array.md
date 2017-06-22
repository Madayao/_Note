@(JavaScript)[JS,Array]

# [Array](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Array)

# Array 常用原型方法

| 名称          | 语法                                       | 描述                                       |
| ----------- | ---------------------------------------- | ---------------------------------------- |
| map         | `array.map(callback(current[, index, array), this])` | 对 array 每个元素调用 callback, 并返回 callback 返回值组成的新数组 |
| forEach     | `array.forEach(callback(current[, index, array), this])` | 对 array 的每个元素执行一次callback                |
| find        | `array.find(callback(current[, index, array), this])` | 对 array 的每个元素执行一次callback, 并返回 callback 返回值为 true 的元素 |
| findIndex   | `array.findIndex(callback(current[, index, array), this])` | 对 array 的每个元素执行一次callback, 并返回 callback 返回值为 true 的元素的索引 |
| indexOf     | `array.indexOf(element[, fromIndex = 0])` | 返回 array 中第一个与 element 严格相等的元素的索引(从 fromIndex 向后) |
| lastIndexOf | `array.lastIndexOf(element[, fromIndex = array.length- 1])` | 返回 array 中倒数第一个与 element 严格相等的元素的索引(从 fromIndex 向前) |
| ----------  |                                          |                                          |
| join        | `string = array.join(separator)`         | 返回 array 中由 separator 分隔的所有元素组成的字符串      |
|             |                                          |                                          |
|             |                                          |                                          |


# 参数解释
| 参数        | 描述                         |
| --------- | -------------------------- |
| callback  | 回调函数                       |
| current   | 当前元素                       |
| index     | 当前元素索引                     |
| array     | 一个数组/被调用的数组                |
| this      | 当前的 this                   |
| fromIndex | 起始索引                       |
|           |                            |
| string    | 一个字符串                      |
| separator | 一个字符串, 用来做分隔符一个字符串, 用来做分隔符 |
|           |                            |
