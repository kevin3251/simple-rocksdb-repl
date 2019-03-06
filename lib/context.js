const level = require('level-rocksdb')
const path = require('path')

let _context
const helpText = {
    help: `
    print help info of function name.
    example:
        db.help('open')
        db.help('close')
        db.help('put')
        db.help('get')
        db.help('del')
        db.help('batch')
    `,
    open: `
    open db at path.
    example:
        db.open('db')
    `,
    close: `
    close the db.
    example:
        db.close()
    `,
    put: `
    put the key/value to the db.
    example:
        db.put('a', '123')
    `,
    get: `
    get the value by key from the db.
    example:
        db.get('a')
    `,
    del: `
    delete the key/value by the key.
    example:
        db.del('a')
    `,
    batch: `
    batch update the db.
    `
}

const db = {
    help(funcName = 'help') {
        if (!(funcName in helpText)) return console.error('no such function')
        console.log( helpText[funcName]) 
    },
    open(dbPath, { valueEncoding = 'json' } = {}) {
        if (typeof dbPath !== 'string') {
            return console.error('dbPath must be typeof stirng')
        }
        this.close()
        let correctPath = path.isAbsolute(dbPath) ? dbPath : path.resolve(dbPath)
        _context.rocks = level(correctPath, { createIfMissing: true, valueEncoding })
        console.log(`open db at '${correctPath}'`)
    },
    close() {
        if (_context.rocks) {
            _context.rocks.close()
        }
    },
    put(key, value) {
        if (!_context.rocks) return console.error('db not opened')
        _context.rocks.put(key, value).then(() => {
            console.log(`put success`, { key, value })
        }).catch(err => console.error(err))
    },
    get(key) {
        if (!_context.rocks) return console.error('db not opened')
        _context.rocks.get(key).then(value => {
            console.log(`get success`, { key, value })
        }).catch(err => console.error(err))
    },
    del(key) {
        if (!_context.rocks) return console.error('db not opened')
        _context.rocks.del(key).then(value => {

        }).catch(err => console.error(err))
    },
    batch(array) {
        if (!_context.rocks) return console.error('db not opened')
        if (!array || Array.isArray(array)) return console.error('type should be array')

        _context.rocks.batch(array).then(() => {
            console.log('batch update success')
        }).catch(err => console.error(err))
    }
}

const utils = { db }

module.exports = {
    init(context) {
        _context = context
        Object.keys(utils).forEach(key => {
            Object.defineProperty(context, key, {
                configurable: false,
                enumerable: true,
                value: utils[key]
            })
        })
    }
}