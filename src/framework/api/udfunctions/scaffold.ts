import { FrameworkUDFunctionsApi } from '~/types/framework/framework.udfunctions';
import { execute } from '~/tools/tasks';
import { Biota } from '~/biota';
import { UDFunctionFromMethod } from '~/factory/api/constructors';
import { factoryApi } from '~/factory';
import { Expr } from 'faunadb';

export const scaffold: FrameworkUDFunctionsApi['scaffold'] = async function (this: Biota) {
  const self = this;
  const tasks = [];

  const loadStep = (step: any) => {
    if (typeof step === 'function') {
      let definition = step();
      if (typeof definition === 'function') definition = definition();

      if (definition instanceof Expr) {
        const UDFunctionDefinition = UDFunctionFromMethod(definition);
        if (UDFunctionDefinition && UDFunctionDefinition.name) {
          if (UDFunctionDefinition.name === 'biota.DocumentGet') {
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

  return execute(tasks, {
    domain: 'Biota.udfunctions.scaffold',
  });
};
