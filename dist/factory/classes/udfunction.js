"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
// biota
const consts_1 = require("~/consts");
function udfunctionNameNormalized(name) {
    return `${consts_1.CONVENTION.UDFUNCTION_PREFIX}${name.replace(consts_1.CONVENTION.UDFUNCTION_PREFIX, "")}`;
}
exports.udfunctionNameNormalized = udfunctionNameNormalized;
function UDFunction(fn) {
    let { name = "", body, data, role } = fn || {};
    let self = {
        name,
        body,
        data,
        role
    };
    return self;
}
exports.UDFunction = UDFunction;
//# sourceMappingURL=udfunction.js.map