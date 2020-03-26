"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
const faunadb_1 = require("faunadb");
function* paginate(paginateQuery, paginateOptions = {}) {
    let after = Infinity;
    while (after) {
        yield this.client
            .query(faunadb_1.query.Paginate(paginateQuery, paginateOptions))
            .then((res) => {
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
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map