import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkTokensApi['expireManyAt'] = async function (nameList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many tokens at ${at}`,
        task() {
          return self.query(tokens(self.context).expireManyAt(nameList, at));
        },
      },
    ],
    {
      domain: 'Biota.tokens.expireManyAt',
    },
  );
};
