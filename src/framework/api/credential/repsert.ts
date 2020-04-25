import { FactoryCredential } from '~/types/factory/factory.credential';
import { FrameworkCredentialApi } from '~/types/framework/framework.credential';
import { credential } from '~/factory/api/credential';
import { execute } from '~/tools/tasks';

export const repsert: FactoryCredential<FrameworkCredentialApi['repsert']> = function (idOrInstance) {
  const self = this;

  return async function repsertMethod(password) {
    return execute(
      [
        {
          name: `Replace/Insert (${idOrInstance})`,
          task() {
            return self.query(credential(self.context)(idOrInstance).repsert(password));
          },
        },
      ],
      {
        domain: 'Biota.credential.repsert',
      },
    );
  };
};
