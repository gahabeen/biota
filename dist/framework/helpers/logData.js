"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// types
// external
const faunadb_1 = require("faunadb");
// biota
const merge = (fieldValues, data = faunadb_1.query.Var("data")) => {
    let dataToMerge = {};
    for (let fieldName in fieldValues) {
        dataToMerge[fieldName] = faunadb_1.query.Merge(faunadb_1.query.Select(fieldName, data, {}), fieldValues[fieldName]);
    }
    return faunadb_1.query.Merge(data, dataToMerge);
};
exports.logData = {
    own() {
        return merge({
            access: {
                owner: faunadb_1.query.Var("ref")
            },
            activity: {
                owner_changed_at: faunadb_1.query.Now(),
                owner_changed_by: faunadb_1.query.Var("userRef")
            }
        });
    },
    credentials() {
        return merge({
            activity: {
                credentials_changed_by: faunadb_1.query.Var("ref"),
                credentials_changed_at: faunadb_1.query.Now()
            }
        }, {});
    },
    assign() {
        return merge({
            access: {
                assignees: faunadb_1.query.Var("ref")
            },
            activity: { assigned_by: faunadb_1.query.Var("userRef"), assigned_at: faunadb_1.query.Now() }
        });
    },
    insert() {
        return merge({
            activity: { created_by: faunadb_1.query.Var("userRef"), created_at: faunadb_1.query.Now() }
        });
    },
    update() {
        return merge({
            activity: { updated_by: faunadb_1.query.Var("userRef"), updated_at: faunadb_1.query.Now() }
        });
    },
    replace() {
        return merge({
            activity: { replaced_by: faunadb_1.query.Var("userRef"), replaced_at: faunadb_1.query.Now() }
        });
    },
    expire() {
        return merge({
            activity: { expired_by: faunadb_1.query.Var("userRef"), expired_at: faunadb_1.query.Var("at") }
        }, {});
    },
    delete() {
        return merge({
            activity: { deleted_by: faunadb_1.query.Var("userRef"), deleted_at: faunadb_1.query.Now() }
        }, {});
    },
    archive() {
        return merge({
            activity: { archived_by: faunadb_1.query.Var("userRef"), archived_at: faunadb_1.query.Now() }
        }, {});
    }
};
//# sourceMappingURL=logData.js.map