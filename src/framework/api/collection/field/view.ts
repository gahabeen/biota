// types
import {
  DBFrameworkCollectionValueOptions,
  FaunaIndexOptions
} from "~/../types/db";
import { DB } from "~/db";
// external
import { query as q } from "faunadb";
// biota
import { execute } from "~/tasks";
import * as helpers from "~/helpers";
import { upsert } from "~/factory";
import { BiotaIndexName } from "~/factory/api";
import * as collectionFactory from "~/factory/api/collection";

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

export async function view(
  this: DB,
  collectionName: string,
  value: DBFrameworkCollectionValueOptions
) {
  let definition: DBFrameworkCollectionValueOptions = valueDefinition(value);

  let index: FaunaIndexOptions = {
    name: null,
    source: {
      collection: q.Collection(collectionName),
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
    helpers.name([collectionName, "view", "as", definition.field])
  );

  let tasks = [
    {
      name: `Creating (value) index: ${index.name}`,
      async task() {
        return this.query(upsert.index(index));
      },
      fullError: true
    }
  ];

  return execute(tasks);
}
