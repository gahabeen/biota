import { Expr, query as q } from 'faunadb';
import { Biota } from '~/biota';
import { factoryApi } from '~/factory';
import { UDFunctionFromMethod, BiotaRoleName } from '~/factory/api/constructors';
import { splitEvery } from '~/helpers';
import { execute } from '~/tools/tasks';
import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { FaunaUDFunctionOptions } from '~/types/fauna';

export const scaffold: FrameworkUDFunctionsApi['scaffold'] = async function (this: Biota, options) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;
  const tasks = [];
  const loadedUDFs = new Set();
  const dependenciesUDFs = new Set();
  const addToRole = {
    [BiotaRoleName('user')]: new Set(),
    [BiotaRoleName('system')]: new Set(),
  };

  const { onlyNecessary, onlyNames = [], onlyNamePatterns = [] } = options || {};

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
        const { definition, dependencies, meta } = UDFunctionFromMethod(stepContent);
        const { addToRoles } = (meta as any) || {};
        if (definition && definition.name) {
          if (!loadedUDFs.has(definition.name)) {
            if (
              dependenciesUDFs.has(definition.name) ||
              onlyNamePatterns.some((pattern) => pattern.test(definition.name)) ||
              (onlyNames.length > 0 && onlyNames.includes(definition.name)) ||
              (onlyNames.length === 0 &&
                ((onlyNecessary && definition.role) || (!onlyNecessary && onlyNames.length === 0 && onlyNamePatterns.length === 0)))
            ) {
              dependencies.map(addDependency);
              markDependencyAsLoaded(definition.name);
              loadedUDFs.add(definition.name);
              if (Array.isArray(addToRoles)) {
                for (const role of Object.keys(addToRole)) {
                  if (!addToRole[role]) addToRole[role] = new Set();
                  addToRole[role].add(definition.name);
                }
              } else {
                addToRole[BiotaRoleName('user')].add(definition.name);
                addToRole[BiotaRoleName('system')].add(definition.name);
              }
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

  for (const role of Object.keys(addToRole)) {
    for (const batch of splitEvery(50, Array.from(addToRole[role])))
      tasks.push({
        name: `Adding privileges to ${role} for ${batch.length} functions`,
        task() {
          return self.role(role).privilege.setMany(
            batch.map((udf: FaunaUDFunctionOptions) => ({
              resource: q.Function(udf),
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
