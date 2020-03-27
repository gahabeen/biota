"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const consts_1 = require("~/consts");
function stringPath(p) {
    if (Array.isArray(p)) {
        return p.map(a => `${a}`).join(".");
    }
    else if (p) {
        p = `${p}`;
        return p;
    }
    else {
        return p;
    }
}
exports.stringPath = stringPath;
function path(p) {
    let pathArray = [];
    if (Array.isArray(p)) {
        pathArray = p.map(a => `${a}`);
    }
    else if (p) {
        p = `${p}`;
        pathArray = p.split(".");
    }
    if (pathArray.length > 0) {
        if (pathArray[0].startsWith("~")) {
            pathArray[0] = pathArray[0].slice(1);
        }
        else {
            pathArray.unshift("data");
        }
    }
    return pathArray;
}
exports.path = path;
function name(texts) {
    return texts.join(consts_1.DOUBLE_SEPARATOR);
}
exports.name = name;
function nameOrOptions(text, options) {
    return typeof text === "object"
        ? text
        : {
            name: text,
            ...options
        };
}
exports.nameOrOptions = nameOrOptions;
function splitTextEvery(nb, text) {
    return `${text}`.match(new RegExp(`.{1,${nb}}`, "g"));
}
exports.splitTextEvery = splitTextEvery;
function splitEvery(nb, items) {
    let result = [];
    let index = 0;
    while (index < items.length) {
        result.push(items.slice(index, (index += nb)));
    }
    return result;
}
exports.splitEvery = splitEvery;
//# sourceMappingURL=index.js.map