import { FrameworkSessionsApi } from 'types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const upsertMany: FrameworkSessionsApi['upsertMany'] = async function (optionsList) {
  const self = this;

  return execute(
    [
      {
        name: `Upsert many sessions`,
        task() {
          return self.query(sessions(self.context).upsertMany(optionsList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.upsertMany',
    },
  );
};
