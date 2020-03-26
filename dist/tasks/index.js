"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function execute(tasks) {
    let ctx = {};
    let results = [];
    for (let task of tasks) {
        console.log(`Running Task: ${task.name}`);
        await new Promise((resolve, reject) => task
            .task(ctx)
            .then(resolve)
            .catch(reject))
            .then(res => results.push(res))
            .catch(error => {
            results.push({ error });
            console.error(`Error running task: ${task.name}: ${error.message}`);
        });
    }
    return results;
}
exports.execute = execute;
//# sourceMappingURL=index.js.map