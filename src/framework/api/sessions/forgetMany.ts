import { FrameworkSessionsApi } from '~/types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const forgetMany: FrameworkSessionsApi['forgetMany'] = async function (nameList) {
  const self = this;

  return execute(
    [
      {
        name: `Forget many sessions`,
        task() {
          return self.query(sessions(self.context).forgetMany(nameList));
        },
      },
    ],
    {
      domain: 'Biota.sessions.forgetMany',
    },
  );
};
