const util = require('util')

module.exports = {
    help: {
        help: 'Print this help message',
        action() {
            Object.keys(this.commands).forEach(key => {
                let keyStr = `${key}`
                keyStr = keyStr.padEnd(12)
                console.log(`.${keyStr} ${this.commands[key].help || ''}`)
            })
        }
    }
}