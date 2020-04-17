import { FrameworkTokensApi } from 'types/framework/framework.tokens';
import { tokens } from '~/factory/api/tokens';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkTokensApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many tokens`,
        task() {
          return self.query(tokens(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.tokens.repsertMany',
    },
  );
};
