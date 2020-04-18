import { FrameworkTokensApi } from '~/types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const updateMany: FrameworkTokensApi['updateMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Update many tokens`,
        task() {
          return self.query(tokens(self.context).updateMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.updateMany',
    },
  );
};
