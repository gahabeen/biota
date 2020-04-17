import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const expireManyIn: FrameworkTokensApi['expireManyIn'] = async function (nameList, delay) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many tokens in ${delay}ms`,
        task() {
          return self.query(tokens(self.context).expireManyIn(nameList, delay));
        },
      },
    ],
    {
      domain: 'Biota.tokens.expireManyIn',
    },
  );
};
