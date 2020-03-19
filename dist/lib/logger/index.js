"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const debug_1 = require("debug");
const chalk = require("chalk");
const listr = require("listr");
const rxjs_1 = require("rxjs");
const delay_1 = require("delay");
exports.logger = debug_1.default;
exports.printer = {
    title: (title, content) => console.log((title ? chalk.bold.gray(title) + ' ' : '') + (content ? chalk.bold.white(content) : '')),
    make: (action = '', type = '', item = '') => {
        let prefix = chalk.bold.gray(action) + ' ' + chalk.bold.white(type) + ' ' + chalk.bold.underline.white(item);
        console.log(prefix);
        return {
            result: (res) => console.log(prefix, chalk.bold.gray('got') + ' ' + chalk.gray(JSON.stringify(res, null, 2))),
            error: (err) => console.log(prefix, chalk.bold.red('cought') + ' ' + chalk.redBright(err))
        };
    },
    success: (x) => console.log(chalk.green(x)),
    info: (x) => console.log(chalk.blue(x)),
    warning: (x) => console.log(chalk.keyword('orange')(x)),
    error: (title, content) => console.log((title ? chalk.red(title) + ' ' : '') + (content ? chalk.bold.redBright(content) : ''))
};
exports.steps = (fn) => {
    const observable = new rxjs_1.Observable(fn);
    // observable.subscribe({
    //   error(err) {}
    // })
    return observable;
};
exports.execute = (items, ctx = {}, run) => {
    let execution = new listr(items.map((item = {}) => {
        let observe = 'observe' in item ? item.observe : true;
        return {
            ...item,
            exitOnError: item.exitOnError,
            task(ctx, task) {
                if (observe) {
                    return new rxjs_1.Observable((step) => {
                        const wrap = (value) => Promise.resolve(value)
                            .then((res) => {
                            step.next('done!');
                            return delay_1.default(500).then(() => {
                                step.complete();
                            });
                        })
                            .catch((err) => {
                            step.next('oups, there has been an error!');
                            return delay_1.default(500).then(() => {
                                // step.complete()
                                step.error({
                                    message: err.message
                                });
                            });
                        });
                        return item.task({ ...ctx, step, wrap }, task);
                    });
                }
                else {
                    return item.task(ctx, task);
                }
            }
        };
    }));
    if (run) {
        return execution.run(ctx);
    }
    else {
        return execution;
    }
};
//# sourceMappingURL=index.js.map