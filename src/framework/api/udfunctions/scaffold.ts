import { Expr, query as q } from 'faunadb';
import { Biota } from '~/biota';
import { factoryApi } from '~/factory';
import { UDFunctionFromMethod, BiotaRoleName } from '~/factory/api/constructors';
import { splitEvery } from '~/helpers';
import { execute } from '~/tools/tasks';
import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';

export const scaffold: FrameworkUDFunctionsApi['scaffold'] = async function (this: Biota, options) {
  const self = this;
  const tasks = [];
  const loadedUDFs = new Set();
  const dependenciesUDFs = new Set();

  const { onlyNecessary, onlyNames = [] } = options || {};

  const loadStep = (step: any) => {
    if (typeof step === 'function') {
      let stepContent = step();
      if (typeof stepContent === 'function') stepContent = stepContent();

      const addDependency = (name: string) => {
        if (!loadedUDFs.has(name)) {
          dependenciesUDFs.add(name);
        }
      };

      const markDependencyAsLoaded = (name: string) => {
        if (dependenciesUDFs.has(name)) {
          dependenciesUDFs.delete(name);
        }
      };

      if (stepContent instanceof Expr) {
        const { definition, subsequentFunctionsToCall } = UDFunctionFromMethod(stepContent);
        if (definition && definition.name) {
          if (!loadedUDFs.has(definition.name)) {
            if (
              dependenciesUDFs.has(definition.name) ||
              (onlyNames.length > 0 && onlyNames.includes(definition.name)) ||
              (onlyNames.length === 0 && ((onlyNecessary && definition.role) || !onlyNecessary))
            ) {
              // if (subsequentFunctionsToCall.length > 0) {
              //   console.log('subsequentFunctionsToCall', subsequentFunctionsToCall);
              // }
              subsequentFunctionsToCall.map(addDependency);
              markDependencyAsLoaded(definition.name);
              loadedUDFs.add(definition.name);
              tasks.push({
                name: `Scaffolding function: ${definition.name}`,
                task() {
                  return self.udfunction(definition.name).upsert(definition);
                },
              });
            }
          }
        }
      } else if (typeof stepContent === 'object') {
        return loadStep(stepContent);
      }
    } else if (typeof step === 'object') {
      return Object.values(step).map((item) => loadStep(item));
    }
  };

  for (const key of Object.keys(factoryApi)) {
    loadStep(factoryApi[key]);
  }

  let maxLoops = 5;
  while (dependenciesUDFs.size > 0 && maxLoops > 0) {
    // console.log('dependenciesUDFs.size', dependenciesUDFs.size);
    for (const key of Object.keys(factoryApi)) {
      loadStep(factoryApi[key]);
    }
    maxLoops -= 1;
  }

  const loadedUDFsBatches = splitEvery(50, Array.from(loadedUDFs));
  for (const loadedUDFsBatch of loadedUDFsBatches) {
    tasks.push({
      name: `Adding privileges to User for ${loadedUDFsBatch.length} functions`,
      task() {
        // return self
        //   .query(
        //     q.Count(
        //       q.Filter(
        //         loadedUDFs.map((UDF) => q.Function(UDF)),
        //         q.Lambda(['udf'], q.Exists(q.Var('udf'))),
        //       ),
        //     ),
        //   )
        //   .then((res: any) => {
        //     console.log(res);
        //     return res;
        //   });
        return self.role(BiotaRoleName('user')).privilege.setMany(
          loadedUDFsBatch.map((UDF) => ({
            resource: q.Function(UDF),
            actions: { call: true },
          })),
        );
      },
    });
    tasks.push({
      name: `Adding privileges to Auth for ${loadedUDFsBatch.length} functions`,
      task() {
        // return self
        //   .query(
        //     q.Count(
        //       q.Filter(
        //         loadedUDFs.map((UDF) => q.Function(UDF)),
        //         q.Lambda(['udf'], q.Exists(q.Var('udf'))),
        //       ),
        //     ),
        //   )
        //   .then((res: any) => {
        //     console.log(res);
        //     return res;
        //   });
        return self.role(BiotaRoleName('auth')).privilege.setMany(
          loadedUDFsBatch.map((UDF) => ({
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
