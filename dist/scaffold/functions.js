"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const faunadb_1 = require("faunadb");
const roles = require("./roles");
exports.changePassword = {
    name: 'ChangePassword',
    body: faunadb_1.query.Query(faunadb_1.query.Lambda(['ref', 'password'], faunadb_1.query.Update(faunadb_1.query.Var('ref'), {
        credentials: {
            password: faunadb_1.query.Var('password')
        }
    }))),
    role: faunadb_1.query.Role(roles.AdminForUser.name)
};
//# sourceMappingURL=functions.js.map