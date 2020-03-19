"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const activity_1 = require("../index/templates/activity");
const defaults_1 = require("../index/defaults");
function scaffoldCollection(name, options = {}) {
    return this.execute([
        {
            title: 'upsert: collection - users',
            task: ({ step, wrap }) => {
                step.next('querying');
                return wrap(this.query(this.upsert.collection('users', {
                    history_days: null,
                    ttl_days: null
                })));
            }
        }
        // {
        //   title: 'scaffold: indexes - users',
        //   task: ({ step, wrap }) => {
        //     return this.scaffold.indexes.for(name)
        //   }
        // }
    ]);
}
function scaffoldCollectionsDefaults() {
    return this.execute([
        {
            title: 'scaffold: defaults',
            task: () => {
                // return Promise.resolve(
                return this.execute([
                    {
                        title: 'scaffold: collection - users',
                        task: ({ step, wrap }) => {
                            step.next('running...');
                            return this.delay(800).then(() => wrap(this.scaffold.collection('users', {
                                history_days: null,
                                ttl_days: null
                            })));
                        }
                    }
                    // {
                    //   title: 'scaffold: collection - actions',
                    //   task: ({ step, wrap }) => {
                    //     step.next('running...')
                    //     return this.scaffold.collection('actions', {
                    //       history_days: null,
                    //       ttl_days: null
                    //     })
                    //   }
                    // }
                ]);
                // ).then(() => {
                //   step.complete()
                // })
            }
        }
    ], {}, true);
}
exports.scaffold = {
    collection: scaffoldCollection,
    collections: {
        defaults: scaffoldCollectionsDefaults
    },
    indexes: {
        defaults: function scaffoldIndexesDefaults() {
            return {
                indexes__by__terms: this.upsert.index(defaults_1.indexes__by__terms),
                indexes__by__resource: this.upsert.index(defaults_1.indexes__by__resource),
                users__by__roles: this.upsert.index(defaults_1.users__by__roles)
            };
        },
        for: function scaffoldIndexeFor(collection) {
            return {
                activity_indexes: activity_1.IndexActivity(collection).map((index) => {
                    return this.upsert.index(index.name, index);
                })
            };
        }
    }
    // functions: {
    //   defaults() {
    //     return ()
    //   },
    //   for(collection: string) {
    //     return ()
    //   }
    // },
    // roles: {
    //   defaults() {
    //     return ()
    //   },
    //   for(collection: string) {
    //     return ()
    //   }
    // }
};
//# sourceMappingURL=scaffold.js.map