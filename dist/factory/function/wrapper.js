"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
function UDFunction(fn) {
    let { name, body, data, role } = fn || {};
    let self = {
        name: `biota.${name.replace("biota.", "")}`,
        body,
        data,
        role,
        setBody(newBody) {
            return UDFunction({ name, body: newBody, data, role });
        },
        setData(newData) {
            return UDFunction({ name, body, data: newData, role });
        },
        setRole(newRole) {
            return UDFunction({ name, body, data, role: newRole });
        }
    };
    return self;
}
exports.UDFunction = UDFunction;
//# sourceMappingURL=wrapper.js.map