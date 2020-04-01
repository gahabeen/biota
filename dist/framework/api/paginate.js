"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
const tasks_1 = require("~/tasks");
function* paginate(paginateQuery, paginateOptions = {}) {
    let after = Infinity;
    while (after) {
        yield tasks_1.execute([
            {
                name: `Paginating your query`,
                task() {
                    return this.client.query(faunadb_1.query.Paginate(paginateQuery, paginateOptions)).then((res) => {
                        if (res.after) {
                            after = res.after;
                        }
                        else {
                            after = undefined;
                        }
                        return res;
                    });
                }
            }
        ], {
            singleResult: true,
            domain: "DB.paginate"
        });
    }
}
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map