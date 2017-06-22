const readFile = function(filename) {
    const p = new Promise(function(resolve, reject) {
        const fs = require('fs')
        const options = {
            encoding: 'utf8'
        }
        fs.readFile(filename, options, function(error, content) {
            if (error !== null) {
                reject(error)
            } else {
                resolve(content)
            }
        })
    })
    return p
}

let promise = readFile('foo.txt')

promise.then(function(content) {
    console.log('debug file content', content)
    const r = content + ' suffix1'
    return r
}, function(error) {
    console.log('debug error message', error)
}).then(function(c) {
    console.log('second then', c)
    const r = c + ' suffix2'
    return r
}).then(function(c) {
    console.log('third then', c)
})

console.log('MARK ****** 首先 log 的是这一行')


promise.then(function(content) {
    console.log('debug file content', content)
}).catch(function(error) {
    console.log('debug error message', error)
})

const fileList = [
    't1.txt',
    't2.txt',
    't3.txt',
]

const list = fileList.map(function(item) {
    const r = readFile(item)
    return r
})

Promise.all(list).then(function(content) {
    console.log('Promise.all, content', content)
})
