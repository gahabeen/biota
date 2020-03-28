"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const db_1 = require("~/db");
const collectionFactory = require("~/factory/api/collection");
async function login(id, password) {
    try {
        const loggedin = await this.query(collectionFactory.collection("users").login(id, password));
        return new db_1.DB({ secret: loggedin.secret });
    }
    catch (e) {
        console.error(e);
    }
}
exports.login = login;
//# sourceMappingURL=login.js.map