"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// biota
const tasks_1 = require("~/tasks");
const upsert_1 = require("~/factory/api/upsert");
const defaultFunctions = require("~/framework/api/default/functions");
const defaultRoles = require("~/framework/api/default/roles");
const defaultCollections = require("~/framework/api/default/collections");
const defaultIndexes = require("~/framework/api/default/indexes");
async function foundation() {
    const self = this;
    let tasks = [];
    /**
     *  Functions
     */
    if (true) {
        for (let UDFunction of Object.values(defaultFunctions)) {
            tasks.push({
                name: `Upserting function: ${UDFunction.name}`,
                task() {
                    return self.query(upsert_1.upsert.function(UDFunction));
                }
            });
        }
    }
    /**
     *  Collections
     */
    if (false) {
        for (let defaultCollection of Object.values(defaultCollections)) {
            tasks.push({
                name: `Scaffold collection: ${defaultCollection.name}`,
                task() {
                    return self.collection(defaultCollection).scaffold();
                }
            });
        }
    }
    /**
     *  Indexes
     */
    if (false) {
        for (let defaultIndex of Object.values(defaultIndexes)) {
            tasks.push({
                name: `Upserting index: ${defaultIndex.name}`,
                task() {
                    return self.query(upsert_1.upsert.index(defaultIndex));
                }
            });
        }
    }
    /**
     *  Roles
     */
    if (false) {
        for (let defaultRole of Object.values(defaultRoles)) {
            tasks.push({
                name: `Upserting role: ${defaultRole.name}`,
                task() {
                    return self.query(upsert_1.upsert.role(defaultRole));
                },
                fullError: false
            });
        }
    }
    return tasks_1.execute(tasks);
}
exports.foundation = foundation;
//# sourceMappingURL=foundation.js.map