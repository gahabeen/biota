import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const replace: FactoryCredential<FrameworkCredentialApi['replace']> = function (idOrInstance) {
  const self = this;

  return async function replaceMethod(password) {
    return execute(
      [
        {
          name: `Replace (${idOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrInstance).replace(password));
          },
        },
      ],
      {
        domain: 'Biota.credential.replace',
      },
    );
  };
};
