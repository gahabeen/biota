import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const insertMany: FrameworkTokensApi['insertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Insert many tokens`,
        task() {
          return self.query(tokens(self.context).insertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.insertMany',
    },
  );
};
