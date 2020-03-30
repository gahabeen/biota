// types
import {
  DBFrameworkCollection,
  DBFrameworkCollectionFieldOptions,
  FaunaIndexOptions,
  Fauna,
  FaunaCollectionOptions,
  DBFrameworkCollectionSearchParams,
  FaunaPaginateOptions,
  FaunaPaginateResponse,
  DBFrameworkCollectionValueOptions,
  FaunaPaginateMapper
} from "~/../types/db";
// external
import * as qs from "querystring";
// biota
import { q } from "~/index";
import { execute } from "~/tasks";
import * as helpers from "~/helpers";
import { BiotaIndexName, NGramOnField } from "~/factory/api/index";
import { BiotaUDFunctionName } from "~/factory/api/udfunction";
import { upsert } from "~/factory/api/upsert";
import { repsert } from "~/factory/api/repsert";
import { update } from "~/factory/api/update";
import * as collectionFactory from "~/factory/api/collection";

export function collection(
  collectionNameOrOptions: string | FaunaCollectionOptions
): DBFrameworkCollection {
  let self = this;

  let collectionDefinition: FaunaCollectionOptions = {
    name: null,
    data: {},
    history_days: 30,
    ttl_days: null
  };

  if (typeof collectionNameOrOptions === "string") {
    collectionDefinition.name = collectionNameOrOptions;
  } else if (typeof collectionNameOrOptions === "object") {
    Object.assign(collectionDefinition, collectionNameOrOptions);
  }

  if (!collectionDefinition.name) {
    throw new Error("biota.collection() - no valid collection name");
  }

  let methods: DBFrameworkCollection = {
    // async changes(){},
    async value() {},
    async field() {},
    async viewable() {},
    async searchable() {},
    async autocomplete() {},
    async scaffold() {},
    async search() {},
    async *paginate() {},
    async import(data) {}
  };

  const valueDefinition = (value: DBFrameworkCollectionValueOptions) => {
    let options: DBFrameworkCollectionValueOptions = {
      field: null,
      values: [],
      binding: null,
      unique: false,
      serialized: true,
      data: {}
    };

    Object.assign(options, value);
    return options;
  };

  const fieldDefinition = (field: string | DBFrameworkCollectionFieldOptions) => {
    let definition: DBFrameworkCollectionFieldOptions = {
      name: undefined,
      field: undefined,
      values: [],
      binding: undefined,
      unique: false,
      ngram: false,
      ngramMin: 3,
      ngramMax: 10,
      searchable: false,
      data: {},
      serialized: undefined,
      permissions: undefined,
      reverse: false
    };

    if (typeof field === "string") {
      definition.name = field;
      definition.field = field;
    } else if (typeof field === "object") {
      Object.assign(definition, field);
    }
    return definition;
  };

  methods.value = async function valueMethod(value) {
    let definition: DBFrameworkCollectionValueOptions = valueDefinition(value);

    let index: FaunaIndexOptions = {
      name: null,
      source: {
        collection: q.Collection(collectionDefinition.name),
        fields: {}
      },
      terms: [
        {
          field: "ref"
        }
      ],
      values: [],
      unique: definition.unique,
      serialized: definition.serialized,
      data: definition.data
    };

    if (value.binding) {
      index.source.fields[definition.field] = definition.binding;
      index.values.push({
        binding: definition.field
      });
    } else if (value.values.length > 0) {
      index.values.push(...value.values);
    }

    index.name = BiotaIndexName(
      helpers.name([collectionDefinition.name, "view", "as", definition.field])
    );

    let tasks = [
      {
        name: `Creating (value) index: ${index.name}`,
        async task() {
          return self.query(upsert.index(index));
        },
        fullError: true
      }
    ];

    return execute(tasks);
  };

  methods.field = async function fieldMethod(field) {
    let definition: DBFrameworkCollectionFieldOptions = fieldDefinition(field);

    let index: FaunaIndexOptions = {
      name: null,
      source: {
        collection: q.Collection(collectionDefinition.name),
        fields: {}
      },
      terms: [],
      values: [],
      unique: definition.unique,
      serialized: definition.serialized,
      permissions: definition.permissions,
      data: definition.data
    };

    // if (!definition.field) {
    //   throw new Error(`biota.field() - no field name has been given`);
    // }

    index.name = BiotaIndexName(
      helpers.name([
        collectionDefinition.name,
        "searchable",
        "by",
        helpers.stringPath(definition.name)
      ])
    );

    let tasks = [];

    if (definition.field) {
      index.terms = [
        {
          field: helpers.path(definition.field),
          reverse: definition.reverse
        }
      ];

      if (definition.ngram) {
        let ngramFieldName = "ngram:" + helpers.stringPath(definition.field);
        let ngramIndex: FaunaIndexOptions = {
          name: BiotaIndexName(
            helpers.name([
              collectionDefinition.name,
              "ngram",
              "on",
              helpers.stringPath(definition.field)
            ])
          ),
          source: {
            collection: q.Collection(collectionDefinition.name),
            fields: {
              [ngramFieldName]: q.Query(
                q.Lambda(
                  "instance",
                  q.Distinct(
                    NGramOnField(
                      definition.ngramMax,
                      helpers.path(definition.field)
                    )
                  )
                )
              )
            }
          },
          terms: [
            {
              binding: ngramFieldName
            }
          ],
          serialized: true,
          data: definition.data
        };

        tasks.push({
          name: `Creating (ngram search) index: ${ngramIndex.name}`,
          async task() {
            return self.query(upsert.index(ngramIndex));
          },
          fullError: true
        });
      }
    }

    if (definition.values.length > 0) {
      index.values = definition.values;
    }

    if (definition.searchable) {
      tasks.push({
        name: `Creating (search) index: ${index.name}`,
        async task() {
          return self.query(upsert.index(index));
        }
      });
    } else if (definition.unique) {
      tasks.push({
        name: `Creating (unique) index: ${index.name}`,
        async task() {
          return self.query(upsert.index(index));
        }
      });
    }

    return execute(tasks);
  };

  methods.viewable = async function viewable(value, options = {}) {
    let { role, roles } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    let tasks = [];

    let definition: DBFrameworkCollectionValueOptions = valueDefinition(value);

    tasks.push({
      name: `Adding viewbale field ${definition.field} on ${collectionDefinition.name}`,
      task() {
        return methods.value(definition).then(async (res: any) => {
          let { ref, name } = res[0] || {};
          if (name && role) {
            let subTasks = [];
            for (let r of roleList) {
              subTasks.push({
                name: `Adding privilege (read) for index ${name} on ${r}`,
                task() {
                  return self.query(
                    update.role(r, {
                      privileges: [
                        {
                          resource: ref,
                          actions: {
                            read: true,
                            history_read: true
                          }
                        }
                      ]
                    })
                  );
                }
              });
            }
            await execute(subTasks);
          }
          return res;
        });
      }
    });

    return execute(tasks);
  };

  methods.searchable = async function searchable(field, options = {}) {
    let { role, roles } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    let tasks = [];

    let definition = {
      field: null,
      searchable: true
    };

    if (typeof field === "string") {
      definition.field = field;
    } else if (typeof field === "object") {
      Object.assign(definition, field);
    }

    tasks.push({
      name: `Adding searchable field ${definition.field} on ${collectionDefinition.name}`,
      task() {
        return methods.field(definition).then(async (res: any) => {
          let { ref, name } = res[0] || {};

          if (name && role) {
            let subTasks = [];
            for (let r of roleList) {
              subTasks.push({
                name: `Adding privilege (read) for index ${name} on ${r}`,
                task() {
                  return self.query(
                    update.role(r, {
                      privileges: [
                        {
                          resource: ref,
                          actions: {
                            read: true,
                            history_read: true
                          }
                        }
                      ]
                    })
                  );
                },
                fullError: true
              });
            }
            await execute(subTasks);
          }
          return res;
        });
      }
    });

    return execute(tasks);
  };

  methods.autocomplete = async function autocomplete(field, options = {}) {
    let { role, roles, maxLength } = options;
    let roleList = role || roles;
    if (!Array.isArray(roleList)) roleList = [role as string];
    let tasks = [];

    let definition = {
      field: null,
      ngram: true,
      searchable: false,
      ngramMax: maxLength
    };

    if (typeof field === "string") {
      definition.field = field;
    } else if (typeof field === "object") {
      Object.assign(definition, field);
    }

    tasks.push({
      name: `Adding ngram field ${definition.field} on ${collectionDefinition.name}`,
      task() {
        return methods.field(definition).then(async (res: any) => {
          let { ref, name } = res[0] || {};
          if (name && role) {
            let subTasks = [];
            for (let r of roleList) {
              subTasks.push({
                name: `Adding privilege (read) for index ${name} on ${r}`,
                task() {
                  return self.query(
                    update.role(r, {
                      privileges: [
                        {
                          resource: ref,
                          actions: {
                            read: true,
                            history_read: true
                          }
                        }
                      ]
                    })
                  );
                },
                fullError: true
              });
            }
            await execute(subTasks);
          }
          return res;
        });
      }
    });

    return execute(tasks);
  };

  methods.scaffold = async function scaffold(options) {
    let defaultSearchable = [
      "~ref",
      "~ts",
      "access.roles",
      "access.owner",
      "access.assignees",
      "activity.assigned_by",
      // "activity.assigned_at",
      "activity.owner_changed_by",
      // "activity.owner_changed_at",
      "activity.credentials_changed_by",
      // "activity.credentials_changed_at",
      "activity.imported_by",
      // "activity.imported_at",
      "activity.created_by",
      // "activity.created_at",
      "activity.updated_by",
      // "activity.updated_at",
      "activity.replaced_by",
      // "activity.replaced_at",
      "activity.expired_by",
      // "activity.expired_at",
      "activity.deleted_by",
      // "activity.deleted_at",
      "activity.archived_by",
      // "activity.archived_at",
      "activity.hidden_by"
      // "activity.hidden_at"
    ];

    let { searchable = defaultSearchable, viewable = [], fields = [] } =
      options || {};

    let tasks = [
      {
        name: `Upserting collection (${collectionDefinition.name})`,
        async task() {
          return self.query(upsert.collection(collectionDefinition));
        }
      }
    ];

    for (let searchableField of searchable) {
      tasks.push({
        name: `Upserting searchable field (${searchableField}) on (${collectionDefinition.name})`,
        async task() {
          return methods.searchable(searchableField, { role: "user" });
        }
      });
    }

    for (let view of viewable) {
      view = valueDefinition(view);
      tasks.push({
        name: `Upserting viewable field (${view.field}) on (${collectionDefinition.name})`,
        async task() {
          return methods.viewable(view);
        }
      });
    }

    for (let field of fields) {
      field = fieldDefinition(field);
      tasks.push({
        name: `Upserting viewable field (${field.field}) on (${collectionDefinition.name})`,
        async task() {
          return methods.field(field);
        }
      });
    }

    return execute(tasks);
  };

  methods.import = async function importFunction(data, options = {}) {
    let { batchSize = 50, keepId = false } = options;
    let items = data;
    if (!Array.isArray(items)) items = [items];
    let batches = helpers.splitEvery(batchSize, items);
    let tasks = [];

    let importQuery: Fauna.Expr;
    if (!keepId) {
      importQuery = q.Create(q.Collection(collectionDefinition.name), {
        data: q.Var("item")
      });
    } else {
      let refId = q.Ref(
        q.Collection(collectionDefinition.name),
        q.Select("id", q.Var("item"), -1)
      );
      importQuery = q.If(
        q.Exists(refId),
        q.Update(refId, { data: q.Select("data", q.Var("item"), {}) }),
        q.Create(refId, {
          data: q.Select("data", q.Var("item"), {})
        })
      );
    }

    for (let [index, batch] of Object.entries(batches)) {
      tasks.push({
        name: `Importing batch n°${index + 1} on ${batches.length}`,
        task() {
          return self.query(q.Map(batch, q.Lambda("item", importQuery)));
        }
      });
    }
    return execute(tasks);
  };

  function parseSearchQuery(collection: string, searchQuery: object) {
    const buildQuery = (sq: Fauna.Expr) => {
      return q.Call(BiotaUDFunctionName("SearchQuery"), [
        q.Collection(collection),
        sq
      ]);
    };

    const safe = (x: object) => JSON.parse(JSON.stringify(x));

    const operators = {
      $and: (...queries: Fauna.Expr[]) => {
        return q.Intersection(...queries.map(buildQuery));
      },
      $or: (...queries: Fauna.Expr[]) => {
        console.log("queries", queries);
        return q.Union(...queries.map(buildQuery));
      },
      $nor: (query: Fauna.Expr, ...queries: Fauna.Expr[]) => {
        return q.Difference(buildQuery(query), ...queries.map(buildQuery));
      }
      // $not: (source: Fauna.Expr, query: Fauna.Expr) =>
      //   q.Difference(source, query)
      // $distinct: (queries: Fauna.Expr[]) => q.Distinct(queries)
    };

    const isOperator = (key: string) => Object.keys(operators).includes(key);
    const hasOperators = (obj: object) =>
      Object.keys(obj).some(key => Object.keys(operators).includes(key));
    const getFirstOperator = (obj: object) => {
      return Object.keys(obj).find(key => isOperator(key));
    };

    // UPDATE!
    const reducer = (obj: object) => {
      let reduced = {};
      const reducee = (value: any, acc: object) => {
        if (typeof value === "object") {
          if (hasOperators(value)) {
            let operator = getFirstOperator(value);
            let operatorValue = value[operator];
            let operation = operators[operator](...operatorValue);
            Object.assign(acc, operation);
          } else {
            for (let key in value) {
              acc[key] = {};
              reducee(value[key], acc[key]);
            }
          }
        } else if (Array.isArray(value)) {
          acc = (value as []).map((item: any) => {
            if (typeof item === "object" || Array.isArray(item)) {
              return reducer(item);
            } else {
              return item;
            }
          });
        } else {
          acc = value;
        }
      };

      reducee(obj, reduced);
      return reduced;
    };

    if (!searchQuery) {
      return q.Documents(q.Collection(collection));
    }

    if (!hasOperators(searchQuery)) {
      return buildQuery(searchQuery);
    } else {
      return reducer(searchQuery);
    }
  }

  methods.search = async function search(
    searchQuery: DBFrameworkCollectionSearchParams,
    paginateOptions: FaunaPaginateOptions = {},
    mapper: FaunaPaginateMapper
  ) {
    let paginate = q.Paginate(
      parseSearchQuery(collectionDefinition.name, searchQuery),
      paginateOptions
    );
    return self.query(mapper ? q.Map(paginate, mapper) : paginate);
  };

  methods.paginate = async function* paginate(
    searchQuery: DBFrameworkCollectionSearchParams,
    paginateOptions: FaunaPaginateOptions = {},
    mapper: FaunaPaginateMapper = q.Lambda("x", q.Get(q.Var("x")))
  ) {
    let firstRequest = true;
    let after: any;
    let paginate = q.Paginate(
      parseSearchQuery(collectionDefinition.name, searchQuery),
      { after, ...paginateOptions }
    );

    while (after || firstRequest) {
      if (firstRequest) firstRequest = false;
      yield self
        .query(mapper ? q.Map(paginate, mapper) : paginate)
        .then((res: FaunaPaginateResponse) => {
          if (res.after) {
            after = res.after;
          } else {
            after = undefined;
          }
          return res;
        });
    }
  };

  return methods;
}

//   methods.search = function* search(
//     searchTerms: DBFrameworkCollectionSearchParams,
//     paginateOptions: FaunaPaginateOptions = {}
//   ) {
//     let firstRequest = true;
//     let after: any;
//     while (after || firstRequest) {
//       if (firstRequest) firstRequest = false;
//       yield self
//         .query(
//           q.Call(BiotaUDFunctionName("Search"), [
//             q.Collection(collectionDefinition.name),
//             searchTerms,
//             { after, ...paginateOptions }
//           ])
//         )
//         .then((res: FaunaPaginateResponse) => {
//           if (res.after) {
//             after = res.after;
//           } else {
//             after = undefined;
//           }
//           return res;
//         });
//     }
//   };

//   return methods;
// }
