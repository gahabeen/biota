import { FrameworkTokensApi } from '~/types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkTokensApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many tokens`,
        task() {
          return self.query(tokens(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.upsertMany',
    },
  );
};
