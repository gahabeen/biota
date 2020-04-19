import { execute } from '~/tools/tasks';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';

export const currentUserActivity: FrameworkUserApi['activity'] = function (this: Biota, pagination = {}) {
  const self = this;
  return execute(
    [
      {
        name: `Activity of current user`,
        async task() {
          return {};
          // return self.user(BiotaCollectionName('actions')).find(
          //   {
          //     user: {
          //       $computed: q.Collection(id),
          //     },
          //   },
          //   pagination,
          // );
        },
      },
    ],
    {
      domain: 'Biota.current.user.activity',
    },
  );
};
