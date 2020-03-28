"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// external
function BiotaUDFunctionName(name) {
    return `biota.${name.replace("biota.", "")}`;
}
exports.BiotaUDFunctionName = BiotaUDFunctionName;
function UDFunction(fn) {
    let { name = "", body, data, role } = fn || {};
    let self = {
        name: BiotaUDFunctionName(name),
        body,
        data,
        role
        // setBody(newBody: Fauna.Expr) {
        //   return UDFunction({ name, body: newBody, data, role });
        // },
        // setData(newData: object) {
        //   return UDFunction({ name, body, data: newData, role });
        // },
        // setRole(newRole: FaunaRef | string) {
        //   return UDFunction({ name, body, data, role: newRole });
        // }
    };
    return self;
}
exports.UDFunction = UDFunction;
//# sourceMappingURL=wrapper.js.map