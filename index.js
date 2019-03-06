#!/usr/bin/env node
const cmd = require('./lib/cmd')
const context = require('./lib/context')
const repl = require('repl')

const server = repl.start({ prompt: '> ' })

Object.keys(cmd).forEach(key => {
    server.defineCommand(key, cmd[key])
})

context.init(server.context)
server.on('reset', context.init)