import { FactoryUser } from '~/types/factory/factory.user';
import { FrameworkUserApi } from '~/types/framework/framework.user';
import { Biota } from '~/biota';
import { user } from '~/factory/api/user';
import { execute } from '~/tools/tasks';

export const membership: FactoryUser<FrameworkUserApi['membership']> = function (this: Biota, id) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return {
    public: {
      async set() {
        return execute(
          [
            {
              name: `(Membership) Set public access on user [${id}]`,
              task() {
                return self.query(user(self.context)(id).membership.public.set());
              },
            },
          ],
          {
            domain: 'Biota.user.membership.public.set',
          },
        );
      },
      remove() {
        return execute(
          [
            {
              name: `(Membership) Remove pubic access onuser  [${id}]`,
              task() {
                return self.query(user(self.context)(id).membership.public.remove());
              },
            },
          ],
          {
            domain: 'Biota.user.membership.public.remove',
          },
        );
      },
    },
    role(roleOrRef) {
      return {
        async set() {
          return execute(
            [
              {
                name: `(Membership) Set role [${roleOrRef}] for user [${id}]`,
                task() {
                  return self.query(user(self.context)(id).membership.role(roleOrRef).set());
                },
              },
            ],
            {
              domain: 'Biota.user.membership.role.set',
            },
          );
        },
        remove() {
          return execute(
            [
              {
                name: `(Membership) Remove role [${roleOrRef}] for user [${id}]`,
                task() {
                  return self.query(user(self.context)(id).membership.role(roleOrRef).remove());
                },
              },
            ],
            {
              domain: 'Biota.user.membership.role.remove',
            },
          );
        },
      };
    },
    owner: {
      async set(owner) {
        return execute(
          [
            {
              name: `(Membership) Set owner [${owner}] of [${id}]`,
              task() {
                return self.query(user(self.context)(id).membership.owner.set(owner));
              },
            },
          ],
          {
            domain: 'Biota.user.membership.owner.set',
          },
        );
      },
      remove(owner) {
        return execute(
          [
            {
              name: `(Membership) Remove owner [${owner}] of [${id}]`,
              task() {
                return self.query(user(self.context)(id).membership.owner.remove(owner));
              },
            },
          ],
          {
            domain: 'Biota.user.membership.owner.remove',
          },
        );
      },
    },
    assignee(assignee) {
      return {
        async set() {
          return execute(
            [
              {
                name: `(Membership) Set assignee [${assignee}] of [${id}]`,
                task() {
                  return self.query(user(self.context)(id).membership.assignee(assignee).set());
                },
              },
            ],
            {
              domain: 'Biota.user.membership.assignee.set',
            },
          );
        },
        remove() {
          return execute(
            [
              {
                name: `(Membership) Remove assignee [${assignee}] of [${id}]`,
                task() {
                  return self.query(user(self.context)(id).membership.assignee(assignee).remove());
                },
              },
            ],
            {
              domain: 'Biota.user.membership.assignee.remove',
            },
          );
        },
      };
    },
  };
};
