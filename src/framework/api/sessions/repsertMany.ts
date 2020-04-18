import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const repsertMany: FrameworkSessionsApi['repsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Replace many sessions`,
        task() {
          return self.query(sessions(self.context).repsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.repsertMany',
    },
  );
};
