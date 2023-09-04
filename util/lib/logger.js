const chalk = require("chalk");
const { alpha } = require("../config");

function log(topic, ...messages) {
    let prefix = chalk.blue(`[${new Date().toLocaleString()}]`);

    if (topic)
        prefix += chalk.green(` [${topic}]`);

    return console.log(prefix, ...messages);
}

function error(topic, ...messages) {
    return console.error(
        chalk.red(`[${new Date().toLocaleString()}] `) +
        chalk.cyan(`[Error${topic ? ":" + topic : ""}]`),
        ...messages);
}

module.exports.log = log;
module.exports.info = alpha ? (() => { }) : ((...args) => process.nextTick(log, ...args));
module.exports.error = (...args) => error(false, ...args);// basic error.
module.exports.ierror = error;