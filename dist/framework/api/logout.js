"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const tasks_1 = require("~/tasks");
async function login(everywhere) {
    return tasks_1.execute([
        {
            name: `Logging out (everywhere: ${everywhere})`,
            task() {
                return this.query(faunadb_1.query.Logout(everywhere));
            }
        }
    ], {
        domain: "DB.logout"
    });
}
exports.login = login;
//# sourceMappingURL=logout.js.map