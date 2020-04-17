import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkTokensApi['expireManyNow'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many tokens now`,
        task() {
          return self.query(tokens(self.context).expireManyNow(nameList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.expireManyNow',
    },
  );
};
