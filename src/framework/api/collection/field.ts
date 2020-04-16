import { query as q } from 'faunadb';
import { FaunaIndexOptions, FaunaIndexTerm, FaunaIndexValue } from '~/../types/fauna';
import { FrameworkCollectionFieldOptions } from '~/../types/framework/framework.collection';
import { Biota } from '~/biota';
import { BiotaIndexName, Index, NGramOnField } from '~/factory/constructors/index';
import { index as indexFactory } from '~/factory/api/index';
import * as helpers from '~/helpers';
import { execute } from '~/tools/tasks';

export function fieldDefinition(fieldInput: string | FrameworkCollectionFieldOptions) {
  const definition: FrameworkCollectionFieldOptions = {
    inputs: [],
    outputs: [],
    // if one field
    field: undefined,
    data: {},
    reverse: false,
    binding: undefined,
    //
    name: undefined,
    action: undefined,
    ngram: false,
    ngramMin: 3,
    ngramMax: 10,
    // values: [],
    unique: false,
    serialized: undefined,
    permissions: undefined,
  };

  if (typeof fieldInput === 'string') {
    definition.name = fieldInput;
    definition.field = fieldInput;
  } else if (typeof fieldInput === 'object') {
    Object.assign(definition, fieldInput);
  }
  return definition;
}

export function field(this: Biota, collectionName: string) {
  const self = this;

  return async function fieldMethod(fieldInput: string | FrameworkCollectionFieldOptions) {
    const definition: FrameworkCollectionFieldOptions = fieldDefinition(fieldInput);

    const index: FaunaIndexOptions = Index({
      source: {
        collection: q.Collection(collectionName),
        fields: {},
      },
      // values: definition.values,
      unique: definition.unique,
      serialized: definition.serialized,
      // permissions: definition.permissions,
      data: definition.data,
    });

    const tasks = [];

    // index inputs [] outputs []
    // index field for search
    // index field for search - ngram
    // index binding (2 ways, as term and as value)

    // tslint:disable-next-line: no-shadowed-variable
    const buildTerm = ({ field: fieldInput, binding, reverse }: { field?: any; binding?: any; reverse?: boolean }, fields = {}) => {
      if (binding) {
        const bindingName = helpers.stringPath(fieldInput || 'cursor');
        fields[bindingName] = binding;
        return { binding: bindingName, reverse };
      } else if (fieldInput) {
        return {
          field: helpers.path(fieldInput),
          reverse,
        };
      }
    };

    // for search
    if (definition.action === 'index') {
      if (definition.field) {
        index.terms = [
          buildTerm({ field: definition.field, binding: definition.binding, reverse: definition.reverse }, index.source.fields),
        ];
      } else if (definition.inputs.length > 0) {
        index.terms = (definition.inputs as FaunaIndexTerm[]).map((input: string | FaunaIndexTerm) => {
          if (typeof input === 'string') {
            return buildTerm({ field: input }, index.source.fields);
          } else if (input.binding) {
            return buildTerm({ field: input.field, binding: input.binding, reverse: input.reverse }, index.source.fields);
          } else if (input.field) {
            return buildTerm({ field: input.field }, index.source.fields);
          }
        });
      } else {
        index.terms = [
          {
            field: ['ref'],
          },
        ];
      }

      if (definition.outputs.length > 0) {
        index.values = (definition.outputs as FaunaIndexValue[]).map((input: string | FaunaIndexValue) => {
          if (typeof input === 'string') {
            return buildTerm({ field: input }, index.source.fields);
          } else if (input.binding) {
            const bindingName = helpers.stringPath(input.field) || 'cursor';
            index.source.fields[helpers.stringPath(bindingName)] = input.binding;
            return buildTerm({ field: input.field, binding: input.binding, reverse: input.reverse }, index.source.fields);
          } else if (input.field) {
            return buildTerm({ field: input.field }, index.source.fields);
          }
        });
      } else {
        index.values = [
          {
            field: ['ref'],
          },
        ];
      }

      index.name = BiotaIndexName(helpers.name([collectionName, 'search', 'on', helpers.stringPath(definition.name || definition.field)]));

      // if (definition.field === "at") {
      //   console.log(JSON.stringify(index, null, 2));
      // }

      if (definition.ngram) {
        if (index.terms.length > 0 && index.terms.length > 1) {
          throw new Error(`Can't produce an ngram index with ${index.terms.length} terms`);
        }

        let fieldName = '';
        try {
          fieldName = helpers.stringPath(definition.field || index.terms[0].field);
        } catch (error) {
          throw new Error(`Couldn't find a correct field name`);
        }

        const ngramFieldName = 'ngram:' + fieldName;
        const ngramIndex: FaunaIndexOptions = {
          name: BiotaIndexName(helpers.name([collectionName, 'ngram', 'on', helpers.stringPath(fieldName)])),
          source: {
            collection: q.Collection(collectionName),
            fields: {
              [ngramFieldName]: q.Query(
                q.Lambda('instance', q.Distinct(NGramOnField(definition.ngramMax, helpers.path(definition.field)))),
              ),
            },
          },
          terms: [
            {
              binding: ngramFieldName,
            },
          ],
          serialized: true,
          data: definition.data,
        };

        tasks.push({
          name: `Creating (ngram search) index: ${ngramIndex.name}`,
          async task() {
            return self.query(indexFactory(self.context)(ngramIndex.name).upsert(ngramIndex));
          },
          fullError: true,
        });
      } else {
        tasks.push({
          name: `Creating (search) index: ${index.name}`,
          async task() {
            return self.query(indexFactory(self.context)(index.name).upsert(index));
          },
        });
      }
    }
    // for value
    else if (definition.action === 'compute') {
      const fieldOrName = definition.field || definition.name;
      index.source.fields[fieldOrName] = definition.binding;

      const indexByBinding = {
        ...index,
        name: BiotaIndexName(helpers.name([collectionName, 'compute', 'on', helpers.stringPath(fieldOrName)])),
        values: [
          {
            binding: fieldOrName,
          },
        ],
        terms: [
          {
            field: ['ref'],
          },
        ],
      };

      tasks.push({
        name: `Creating (search compute) index: ${indexByBinding.name}`,
        async task() {
          return self.query(indexFactory(self.context)(indexByBinding.name).upsert(indexByBinding));
        },
      });

      // let indexByRef = {
      //   ...index,
      //   name: BiotaIndexName(
      //     helpers.name([collectionName, "computed", "as", helpers.stringPath(definition.name || definition.field)])
      //   ),
      //   values: [
      //     {
      //       field: ["ref"]
      //     }
      //   ],
      //   terms: [
      //     {
      //       binding: definition.field
      //     }
      //   ]
      // };

      // tasks.push({
      //   name: `Creating (compute value) index: ${indexByRef.name}`,
      //   async task() {
      //     return self.query(upsert.index(indexByRef));
      //   }
      // });
    }

    // console.log("definition", definition);

    return execute(tasks, {
      domain: 'Biota.collection.field',
      singleResult: false,
    });
  };
}
