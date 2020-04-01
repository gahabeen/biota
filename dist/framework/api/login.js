"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const db_1 = require("~/db");
const collectionFactory = require("~/factory/api/collection");
const tasks_1 = require("~/tasks");
async function login(id, password) {
    return tasks_1.execute([
        {
            name: `Loggin in as (${id})`,
            task() {
                return this.query(collectionFactory.collection("users").login(id, password)).then(({ secret }) => new db_1.DB({ secret }));
            }
        }
    ], {
        domain: "DB.login"
    });
}
exports.login = login;
//# sourceMappingURL=login.js.map