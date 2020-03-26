// types
import {
  DBFrameworkCollection,
  DBFrameworkCollectionFieldOptions,
  FaunaIndexOptions
} from "~/../types/db";
import { DB } from "~/db";
// external
// biota
import { q } from "~/index";
import { execute } from "~/tasks";
import * as helpers from "~/helpers";
import { IndexName } from "~/factory/api/index";
import { upsert } from "~/factory/api/upsert";

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
    async search(params) {}
  };
}
