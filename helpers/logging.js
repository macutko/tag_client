const chalk = require("chalk");

log = (username, text) => {
    console.log(chalk.bgGreenBright.bold(username) + ` ${text}`)
}
timer = (username, text) => {
    console.log(chalk.bgRedBright.bold(username) + ` ${text}`)
}
module.exports = {log, timer}