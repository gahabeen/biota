import { Expr, query as q } from 'faunadb';
import { Biota } from '~/biota';
import { factoryApi } from '~/factory';
import { UDFunctionFromMethod } from '~/factory/api/constructors';
import { splitEvery } from '~/helpers';
import { execute } from '~/tools/tasks';
import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';

export const scaffold: FrameworkUDFunctionsApi['scaffold'] = async function (this: Biota, options) {
  const self = this;
  const tasks = [];
  const UDFs = [];

  const { onlyNecessary } = options || {};

  const loadStep = (step: any) => {
    if (typeof step === 'function') {
      let definition = step();
      if (typeof definition === 'function') definition = definition();

      if (definition instanceof Expr) {
        const UDFunctionDefinition = UDFunctionFromMethod(definition);
        if (UDFunctionDefinition && UDFunctionDefinition.name) {
          if ((onlyNecessary && UDFunctionDefinition.role) || !onlyNecessary) {
            UDFs.push(UDFunctionDefinition.name);
            tasks.push({
              name: `Scaffolding function: ${UDFunctionDefinition.name}`,
              task() {
                return self.udfunction(UDFunctionDefinition.name).upsert(UDFunctionDefinition);
              },
            });
          }
        }
      } else if (typeof definition === 'object') {
        return loadStep(definition);
      }
    } else if (typeof step === 'object') {
      return Object.values(step).map((item) => loadStep(item));
    }
  };

  for (const key of Object.keys(factoryApi)) {
    loadStep(factoryApi[key]);
  }

  const UDFsBatches = splitEvery(50, UDFs);
  for (const UDFsBatch of UDFsBatches) {
    tasks.push({
      name: `Adding privileges to User for ${UDFsBatch.length} functions`,
      task() {
        // return self
        //   .query(
        //     q.Count(
        //       q.Filter(
        //         UDFs.map((UDF) => q.Function(UDF)),
        //         q.Lambda(['udf'], q.Exists(q.Var('udf'))),
        //       ),
        //     ),
        //   )
        //   .then((res: any) => {
        //     console.log(res);
        //     return res;
        //   });
        return self.role('biota.user').privilege.setMany(
          UDFsBatch.map((UDF) => ({
            resource: q.Function(UDF),
            actions: { call: true },
          })),
        );
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.udfunctions.scaffold',
    singleResult: false,
  });
};
