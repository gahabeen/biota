import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const replace: FactoryCredential<FrameworkCredentialApi['replace']> = function (idOrRefOrInstance) {
  const self = this;

  return async function replaceMethod(password) {
    return execute(
      [
        {
          name: `Replace (${idOrRefOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrRefOrInstance).replace(password));
          },
        },
      ],
      {
        domain: 'Biota.credential.replace',
      },
    );
  };
};
