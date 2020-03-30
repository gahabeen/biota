"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// biota
const collection_1 = require("~/factory/api/collection");
const helpers_1 = require("~/helpers");
const tasks_1 = require("~/tasks");
function relation(relationName) {
    let self = this;
    let definition = {
        name: relationName,
        // Does the relation implies deep destruction/delete
        destructive: false,
        parts: []
    };
    async function buildRelation() {
        if (!definition.name)
            definition.name = helpers_1.name([""]);
        let relations = definition.parts.map(p => p.relation);
        let firstRelation = definition.parts[0];
        let secondRelation = definition.parts[1];
        let tasks = [];
        tasks.push({
            async task() {
                let existingRelations = await self
                    .collection(collection_1.BiotaCollectionName("relations"))
                    .search({
                    $and: [
                        {
                            "parts.collection": firstRelation.collection,
                            "parts.relation": firstRelation.relation,
                            "parts.path": firstRelation.path
                        },
                        {
                            "parts.collection": secondRelation.collection,
                            "parts.relation": secondRelation.relation,
                            "parts.path": secondRelation.path
                        }
                    ]
                });
                return self.query(collection_1.collection(collection_1.BiotaCollectionName("relations")).create({
                    data: {
                        relations: {}
                    }
                }));
            }
        });
        // one-to-one
        if (relations.includes("one") && !relations.includes("many")) {
        }
        // many-to-one / one-to-many
        else if (relations.includes("one") && relations.includes("many")) {
        }
        // many-to-many
        else if (relations.includes("many") && !relations.includes("one")) {
        }
        else {
            throw new Error(`Relation ${helpers_1.name} isn't right`);
        }
        return tasks_1.execute(tasks);
    }
    let firstApi = {
        many: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "many",
                collection: collection_1.CollectionNamePlural(collection),
                path
            });
            return secondApi;
        },
        one: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "one",
                collection: collection_1.CollectionNamePlural(collection),
                path
            });
            return secondApi;
        }
    };
    let secondMethods = {
        many: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "many",
                collection: collection_1.CollectionNamePlural(collection),
                path
            });
            return buildRelation();
        },
        one: function (collection, path = "~ref") {
            definition.parts.push({
                relation: "one",
                collection: collection_1.CollectionNamePlural(collection),
                path
            });
            return buildRelation();
        }
    };
    let secondApi = {
        connects: secondMethods,
        can: {
            have: secondMethods
        }
    };
    return firstApi;
}
exports.relation = relation;
//# sourceMappingURL=relation.js.map