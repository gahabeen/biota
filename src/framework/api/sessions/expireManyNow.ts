import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const expireManyNow: FrameworkSessionsApi['expireManyNow'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many sessions now`,
        task() {
          return self.query(sessions(self.context).expireManyNow(nameList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.expireManyNow',
    },
  );
};
