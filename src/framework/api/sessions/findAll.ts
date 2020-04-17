import { FrameworkSessionsApi } from 'types/framework/framework.sessions';
import { sessions } from '~/factory/api/sessions';
import { execute } from '~/tools/tasks';

export const findAll: FrameworkSessionsApi['findAll'] = async function (pagination = {}) {
  const self = this;

  return execute(
    [
      {
        name: `Find all sessions`,
        task() {
          return self.query(sessions(self.context).findAll(pagination));
        },
      },
    ],
    {
      domain: 'Biota.sessions.findAll',
    },
  );
};
