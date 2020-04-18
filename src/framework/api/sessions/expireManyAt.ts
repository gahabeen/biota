import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const expireManyAt: FrameworkSessionsApi['expireManyAt'] = async function (nameList, at) {
  const self = this;

  return execute(
    [
      {
        name: `Expire many sessions at ${at}`,
        task() {
          return self.query(sessions(self.context).expireManyAt(nameList, at));
        },
      },
    ],
    {
      domain: 'Biota.sessions.expireManyAt',
    },
  );
};
