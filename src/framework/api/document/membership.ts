import { FactoryDocument } from '~/types/factory/factory.document';
import { FrameworkDocumentApi } from '~/types/framework/framework.document';
import { Biota } from '~/biota';
import { document } from '~/factory/api/document';
import { execute } from '~/tools/tasks';

export const membership: FactoryDocument<FrameworkDocumentApi['membership']> = function (this: Biota, collectionName, id) {
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const self = this;

  return {
    public: {
      async set() {
        return execute(
          [
            {
              name: `(Membership) Set public access on [${collectionName}/${id}]`,
              task() {
                return self.query(document(self.context)(collectionName, id).membership.public.set());
              },
            },
          ],
          {
            domain: 'Biota.document.membership.public.set',
          },
        );
      },
      remove() {
        return execute(
          [
            {
              name: `(Membership) Remove pubic access on [${collectionName}/${id}]`,
              task() {
                return self.query(document(self.context)(collectionName, id).membership.public.remove());
              },
            },
          ],
          {
            domain: 'Biota.document.membership.public.remove',
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
                name: `(Membership) Set role [${roleOrRef}] on [${collectionName}/${id}]`,
                task() {
                  return self.query(document(self.context)(collectionName, id).membership.role(roleOrRef).set());
                },
              },
            ],
            {
              domain: 'Biota.document.membership.role.set',
            },
          );
        },
        remove() {
          return execute(
            [
              {
                name: `(Membership) Remove role [${roleOrRef}] on [${collectionName}/${id}]`,
                task() {
                  return self.query(document(self.context)(collectionName, id).membership.role(roleOrRef).remove());
                },
              },
            ],
            {
              domain: 'Biota.document.membership.role.remove',
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
              name: `(Membership) Set owner [${owner}] of [${collectionName}/${id}]`,
              task() {
                return self.query(document(self.context)(collectionName, id).membership.owner.set(owner));
              },
            },
          ],
          {
            domain: 'Biota.document.membership.owner.set',
          },
        );
      },
      remove(owner) {
        return execute(
          [
            {
              name: `(Membership) Remove owner [${owner}] of [${collectionName}/${id}]`,
              task() {
                return self.query(document(self.context)(collectionName, id).membership.owner.remove(owner));
              },
            },
          ],
          {
            domain: 'Biota.document.membership.owner.remove',
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
                name: `(Membership) Set assignee [${assignee}] of [${collectionName}/${id}]`,
                task() {
                  return self.query(document(self.context)(collectionName, id).membership.assignee(assignee).set());
                },
              },
            ],
            {
              domain: 'Biota.document.membership.assignee.set',
            },
          );
        },
        remove() {
          return execute(
            [
              {
                name: `(Membership) Remove assignee [${assignee}] of [${collectionName}/${id}]`,
                task() {
                  return self.query(document(self.context)(collectionName, id).membership.assignee(assignee).remove());
                },
              },
            ],
            {
              domain: 'Biota.document.membership.assignee.remove',
            },
          );
        },
      };
    },
  };
};
