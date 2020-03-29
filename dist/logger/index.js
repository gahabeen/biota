// import debug from 'debug'
// import * as chalk from 'chalk'
// import * as listr from 'listr'
// import { Observable } from 'rxjs'
// import delay from 'delay'
// export const logger = debug
// export const printer = {
//   title: (title, content) => console.log((title ? chalk.bold.gray(title) + ' ' : '') + (content ? chalk.bold.white(content) : '')),
//   make: (action = '', type = '', item = '') => {
//     let prefix = chalk.bold.gray(action) + ' ' + chalk.bold.white(type) + ' ' + chalk.bold.underline.white(item)
//     console.log(prefix)
//     return {
//       result: (res) => console.log(prefix, chalk.bold.gray('got') + ' ' + chalk.gray(JSON.stringify(res, null, 2))),
//       error: (err) => console.log(prefix, chalk.bold.red('cought') + ' ' + chalk.redBright(err))
//     }
//   },
//   success: (x) => console.log(chalk.green(x)),
//   info: (x) => console.log(chalk.blue(x)),
//   warning: (x) => console.log(chalk.keyword('orange')(x)),
//   error: (title, content) => console.log((title ? chalk.red(title) + ' ' : '') + (content ? chalk.bold.redBright(content) : ''))
// }
// export const steps = (fn) => {
//   const observable = new Observable(fn)
//   // observable.subscribe({
//   //   error(err) {}
//   // })
//   return observable
// }
// export const execute = (items: any[], ctx: object = {}, run: boolean) => {
//   let execution = new listr(
//     items.map((item = {}) => {
//       let observe = 'observe' in item ? item.observe : true
//       return {
//         ...item,
//         exitOnError: item.exitOnError,
//         task(ctx: any, task: any) {
//           if (observe) {
//             return new Observable((step) => {
//               const wrap = (value) =>
//                 Promise.resolve(value)
//                   .then((res) => {
//                     step.next('done!')
//                     return delay(500).then(() => {
//                       step.complete()
//                     })
//                   })
//                   .catch((err) => {
//                     step.next('oups, there has been an error!')
//                     return delay(500).then(() => {
//                       // step.complete()
//                       step.error({
//                         message: err.message
//                       })
//                     })
//                   })
//               return item.task({ ...ctx, step, wrap }, task)
//             })
//           } else {
//             return item.task(ctx, task)
//           }
//         }
//       }
//     })
//   )
//   if (run) {
//     return execution.run(ctx)
//   } else {
//     return execution
//   }
// }
//# sourceMappingURL=index.js.map