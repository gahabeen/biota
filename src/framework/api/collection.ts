// types
import {
  DBFrameworkCollection,
  DBFrameworkCollectionFieldOptions,
  FaunaIndexOptions,
  Fauna
} from "~/../types/db";
// external
// biota
import { q } from "~/index";
import { execute } from "~/tasks";
import * as helpers from "~/helpers";
import { IndexName } from "~/factory/api/index";
import { upsert } from "~/factory/api/upsert";
import * as collectionFactory from "~/factory/api/collection";

export function collection(collectionName: string): DBFrameworkCollection {
  let self = this;

  async function fieldMethod(
    field: string | string[] | DBFrameworkCollectionFieldOptions
  ) {
    let options: DBFrameworkCollectionFieldOptions = {
      field: null,
      binding: null,
      unique: false,
      autocomplete: false,
      searchable: false,
      data: {},
      serialized: null,
      permissions: null
    };

    let index: FaunaIndexOptions = {
      name: null,
      source: {
        collection: q.Collection(collectionName),
        fields: {}
      },
      terms: [],
      values: [],
      unique: options.unique,
      serialized: options.serialized,
      permissions: options.permissions,
      data: options.data
    };

    if (typeof field === "string") {
      options.field = field;
    } else if (typeof field === "object") {
      Object.assign(options, field);
    }

    if (!options.field) {
      throw new Error(`biota.field() - no field name has been given`);
    }

    index.name = IndexName(
      helpers.name([
        collectionName,
        "searchable",
        "by",
        helpers.stringPath(options.field)
      ])
    );

    index.terms = [
      {
        field: helpers.path(options.field)
      }
    ];

    let tasks = [
      {
        name: `Creating index: ${index.name}`,
        async task() {
          return self.query(upsert.index(index));
        }
      }
    ];

    return execute(tasks);
  }

  return {
    field: fieldMethod,
    async searchable(field) {
      if (typeof field === "string") {
        return fieldMethod({ field, searchable: true });
      } else {
        return fieldMethod({ ...field, searchable: true });
      }
    },
    async scaffold() {
      let tasks = [
        {
          name: `Creating collection: ${collectionName}`,
          async task() {
            return self.query(
              upsert.collection({
                name: collectionName,
                history_days: null,
                ttl_days: null
              })
            );
          }
        }
      ];

      return execute(tasks);
    },
    async search(params) {},
    async import(data, options = {}) {
      let { batchSize = 50, keepId = false } = options;
      let items = data;
      if (!Array.isArray(items)) items = [items];
      let batches = helpers.splitEvery(batchSize, items);
      let tasks = [];
      let createQuery: Fauna.Expr;
      if (!keepId) {
        createQuery = collectionFactory
          .collection(collectionName)
          .create(q.Var("item"));
      } else {
        createQuery = collectionFactory
          .collection(collectionName)
          .upsert(
            q.Select("id", q.Var("item"), null),
            q.Select("data", q.Var("item"), null)
          );
      }
      for (let [index, batch] of Object.entries(batches)) {
        tasks.push({
          name: `Importing batch n°${index + 1} on ${batches.length}`,
          task() {
            return self.query(q.Map(batch, q.Lambda("item", createQuery)));
          }
        });
      }
      return execute(tasks);
    }
  };
}
