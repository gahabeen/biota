"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// biota
const tasks_1 = require("~/tasks");
const defaultFunctions = require("~/framework/api/default/functions");
const upsert_1 = require("~/factory/api/upsert");
function foundation() {
    const self = this;
    let tasks = [];
    for (let UDFunction of Object.values(defaultFunctions)) {
        tasks.push({
            name: `Upserting function: ${UDFunction.name}`,
            task() {
                return self.query(upsert_1.upsert.function(UDFunction));
            }
        });
    }
    return tasks_1.execute(tasks);
}
exports.foundation = foundation;
//# sourceMappingURL=foundation.js.map