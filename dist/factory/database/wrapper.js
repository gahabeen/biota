"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function Database(database) {
    let { name, data = {}, api_version } = database || {};
    let self = {
        name,
        data,
        api_version
    };
    return self;
}
exports.Database = Database;
//# sourceMappingURL=wrapper.js.map