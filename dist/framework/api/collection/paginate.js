"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const tasks_1 = require("~/tasks");
function paginate(collectionDefinition) {
    let self = this;
    return async function* paginateMethod(searchQuery, paginateOptions = {}, mapper) {
        let firstRequest = true;
        let after;
        while (after || firstRequest) {
            if (firstRequest)
                firstRequest = false;
            yield tasks_1.execute([
                {
                    name: `Paginate after ${after} in (${collectionDefinition.name})`,
                    async task() {
                        return self
                            .collection(collectionDefinition.name)
                            .find(searchQuery, { ...paginateOptions, after }, mapper)
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
            ], {
                domain: "DB.collection.paginate"
            });
        }
    };
}
exports.paginate = paginate;
//# sourceMappingURL=paginate.js.map