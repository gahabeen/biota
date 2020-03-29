"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
// biota
const tasks_1 = require("~/tasks");
const create_1 = require("~/factory/api/create");
const upsert_1 = require("~/factory/api/upsert");
const repsert_1 = require("~/factory/api/repsert");
const defaultFunctions = require("~/framework/api/default/functions");
const defaultRoles = require("~/framework/api/default/roles");
const defaultCollections = require("~/framework/api/default/collections");
const defaultIndexes = require("~/framework/api/default/indexes");
async function foundation() {
    const self = this;
    let tasks = [];
    /**
     *  Roles (base)
     */
    if (true) {
        for (let defaultRole of Object.values(defaultRoles)) {
            tasks.push({
                name: `Creating (base) role: ${defaultRole.name}`,
                task() {
                    return self.query(faunadb_1.query.If(faunadb_1.query.Exists(faunadb_1.query.Role(defaultRole.name)), null, create_1.create.role(defaultRole.name)));
                }
            });
        }
    }
    /**
     *  Functions
     */
    if (true) {
        for (let UDFunction of Object.values(defaultFunctions)) {
            tasks.push({
                name: `Upserting function: ${UDFunction.name}`,
                task() {
                    return self.query(repsert_1.repsert.function(UDFunction));
                },
                fullError: true
            });
        }
    }
    /**
     *  Collections
     */
    if (true) {
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
    if (true) {
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
    if (true) {
        for (let defaultRole of Object.values(defaultRoles)) {
            tasks.push({
                name: `Upserting role: ${defaultRole.name}`,
                task() {
                    return self.query(upsert_1.upsert.role(defaultRole));
                },
                fullError: true
            });
        }
    }
    return tasks_1.execute(tasks);
}
exports.foundation = foundation;
//# sourceMappingURL=foundation.js.map