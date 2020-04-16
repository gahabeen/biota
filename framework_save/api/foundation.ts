import { Biota } from '~/biota';
import { query as q } from 'faunadb';
import { execute } from '~/tools/tasks';
import { role as roleFQLBase } from '~/factory/api/fql/base/role';
import { insert } from '~/factory/api/fql/base/insert';
import { upsert } from '~/factory/api/fql/base/upsert';
import { repsert } from '~/factory/api/fql/base/repsert';
import * as defaultFunctions from '~/framework/api/defaults/udfunctions';
import * as defaultRoles from '~/framework/api/defaults/roles';
import * as defaultCollections from '~/framework/api/defaults/collections';
import * as defaultIndexes from '~/framework/api/defaults/indexes';
import { BiotaFoundationOptions } from '~/../types/db';
import { FaunaUDFunctionOptions } from '~/../types/fauna';
import { BiotaRoleName } from '~/factory/constructors/role';
import { delay } from '~/helpers/delay';

export async function foundation(this: Biota, options: BiotaFoundationOptions) {
  const self = this;
  options = { roles: true, udfunctions: true, collections: true, indexes: true, ...options };
  const tasks = [];

  /**
   *  Roles (base)
   */

  if (options.roles) {
    const initialRoleTasks = [];
    for (let defaultRole of Object.values(defaultRoles)) {
      initialRoleTasks.push({
        name: `Creating (base) role: ${defaultRole.name}`,
        task() {
          return self.query(q.If(q.Exists(q.Role(defaultRole.name)), null, insert.role(defaultRole.name, { privileges: [] })));
        },
      });
    }

    tasks.push({
      name: 'Initial roles',
      async task() {
        return execute(initialRoleTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  /**
   *  Functions
   */

  if (options.udfunctions) {
    let initialUDFunctionsTasks = [];
    initialUDFunctionsTasks.push({
      name: `Upserting udfunction function [${defaultFunctions.InsertUDFunction.name}]`,
      task() {
        return self.query(
          repsert.udfunction(defaultFunctions.InsertUDFunction.name, defaultFunctions.InsertUDFunction as FaunaUDFunctionOptions),
        );
      },
      fullError: true,
    });

    initialUDFunctionsTasks.push({
      name: `Upserting udfunction function [${defaultFunctions.UpdateUDFunction.name}]`,
      task() {
        return self.query(
          repsert.udfunction(defaultFunctions.UpdateUDFunction.name, defaultFunctions.UpdateUDFunction as FaunaUDFunctionOptions),
        );
      },
      fullError: true,
    });

    initialUDFunctionsTasks.push({
      name: `Upserting udfunction function [${defaultFunctions.ReplaceUDFunction.name}]`,
      task() {
        return self.query(
          repsert.udfunction(defaultFunctions.ReplaceUDFunction.name, defaultFunctions.ReplaceUDFunction as FaunaUDFunctionOptions),
        );
      },
      fullError: true,
    });

    tasks.push({
      name: 'Initial UDFunctions',
      async task() {
        return execute(initialUDFunctionsTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });

    let otherUDFunctionsTasks = [];
    for (let UDFunction of Object.values(defaultFunctions)) {
      let UDFunctionDefinition = UDFunction;
      if (typeof UDFunctionDefinition === 'function') {
        UDFunctionDefinition = (UDFunctionDefinition as any)({ privateKey: self.private_key || null });
      }
      otherUDFunctionsTasks.push({
        name: `Upserting function: ${UDFunctionDefinition.name}`,
        task() {
          // return self.udfunction(UDFunctionDefinition.name).repsert(UDFunctionDefinition);
          return self.query(repsert.udfunction(UDFunctionDefinition.name, UDFunctionDefinition as FaunaUDFunctionOptions));
        },
        fullError: true,
      });
    }
    tasks.push({
      name: 'Other UDFunctions',
      async task() {
        return execute(otherUDFunctionsTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  /**
   *  Roles (functions privileges)
   */

  if (options.roles) {
    let intialRolesTasks = [];
    for (let defaultRole of Object.values(defaultRoles)) {
      intialRolesTasks.push({
        name: `Adding UDFunction privileges to role: ${defaultRole.name}`,
        task() {
          let functionPrivileges = defaultRole.privileges.filter((p) => {
            let resource = (p.resource as any).toJSON() || {};
            return resource.function;
          });
          return self.query(upsert.role(defaultRole.name, { privileges: functionPrivileges }));
          // return Promise.all(functionPrivileges.map((privilege) => self.query(self.role(defaultRole.name).privilege.upsert(privilege))));
        },
      });
    }

    tasks.push({
      name: 'Initial Roles',
      async task() {
        return execute(intialRolesTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  /**
   *  Collections (creation)
   */

  if (options.collections) {
    const collectionsTasks = [];
    collectionsTasks.push({
      name: `Upsert collection: ${defaultCollections.user_sessions.name}`,
      task() {
        return self.query(upsert.collection(defaultCollections.user_sessions.name, defaultCollections.user_sessions));
      },
    });

    collectionsTasks.push({
      name: `Upsert collection: ${defaultCollections.actions.name}`,
      task() {
        return self.query(upsert.collection(defaultCollections.actions.name, defaultCollections.actions));
      },
    });

    collectionsTasks.push({
      name: `Upsert collection: ${defaultCollections.users.name}`,
      task() {
        return self.query(upsert.collection(defaultCollections.users.name, defaultCollections.users));
      },
    });

    collectionsTasks.push({
      name: `Upsert collection: ${defaultCollections.relations.name}`,
      task() {
        return self.query(upsert.collection(defaultCollections.relations.name, defaultCollections.relations));
      },
      fullError: true,
    });

    tasks.push({
      name: 'Initial Collections',
      async task() {
        return execute(collectionsTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  /**
   *  Indexes
   */

  if (options.indexes) {
    let indexesTasks = [];
    for (let defaultIndex of Object.values(defaultIndexes)) {
      indexesTasks.push({
        name: `Upserting index: ${defaultIndex.name}`,
        task() {
          return self.query(upsert.index(defaultIndex.name, defaultIndex));
        },
      });
    }

    tasks.push({
      name: 'Indexes',
      async task() {
        return execute(indexesTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  /**
   *  Roles
   */

  if (options.roles) {
    let rolesTasks = [];
    for (let defaultRole of Object.values(defaultRoles)) {
      for (let membership of (defaultRole.membership as []) || []) {
        rolesTasks.push({
          name: `Upserting role membership: ${defaultRole.name}`,
          async task() {
            await delay(300);
            await self.query(roleFQLBase.membership.upsert(defaultRole.name, membership));
            // return self.role(defaultRole.name).membership.upsert(membership);
          },
        });
      }
      for (let privilege of defaultRole.privileges || []) {
        rolesTasks.push({
          name: `Upserting role privilege: ${defaultRole.name}`,
          async task() {
            await delay(300);
            await self.query(roleFQLBase.privileges.upsert(defaultRole.name, privilege));
            // return self.role(defaultRole.name).privilege.upsert(privilege);
          },
        });
      }
    }
    tasks.push({
      name: 'Roles',
      async task() {
        return execute(rolesTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  /**
   *  Collections (scaffold)
   */

  if (options.collections) {
    let collectionsTasks = [];
    collectionsTasks.push({
      name: `Scaffold collection: ${defaultCollections.user_sessions.name}`,
      task() {
        return self.collection(defaultCollections.user_sessions.name).scaffold(defaultCollections.user_sessions, { roles: [] });
      },
    });

    collectionsTasks.push({
      name: `Scaffold collection: ${defaultCollections.actions.name}`,
      task() {
        return self.collection(defaultCollections.actions.name).scaffold(defaultCollections.actions, {
          roles: [],
          index: [
            'document',
            'ts',
            'user',
            'name',
            {
              field: 'collection',
              binding: q.Query(q.Lambda('doc', q.Select(['data', 'document', 'collection'], q.Var('doc'), null))),
            },
            {
              field: 'at',
              binding: q.Query(
                q.Lambda(
                  'doc',
                  q.Let(
                    {
                      ts: q.Select('ts', q.Var('doc'), null),
                    },
                    q.If(q.IsTimestamp(q.Var('ts')), q.ToTime(q.Var('ts')), null),
                  ),
                ),
              ),
            },
          ],
        });
      },
    });

    collectionsTasks.push({
      name: `Scaffold collection: ${defaultCollections.users.name}`,
      task() {
        return self.collection(defaultCollections.users.name).scaffold(defaultCollections.users, {
          roles: [],
        });
      },
    });

    collectionsTasks.push({
      name: `Scaffold collection: ${defaultCollections.relations.name}`,
      task() {
        return self.collection(defaultCollections.relations.name).scaffold(defaultCollections.relations, {
          // index: ["name", "parts.relation", "parts.collection", "parts.path"],
          // field: [
          //   {
          //     field: "uniqueness_check",
          //     unique: true,
          //     outputs: [
          //       {
          //         field: "data.parts.0.relation",
          //       },
          //       {
          //         field: "data.parts.0.collection",
          //       },
          //       {
          //         field: "data.parts.0.path",
          //       },
          //       {
          //         field: "data.parts.1.relation",
          //       },
          //       {
          //         field: "data.parts.1.collection",
          //       },
          //       {
          //         field: "data.parts.1.path",
          //       },
          //     ],
          //   },
          // ],
        });
      },
      fullError: true,
    });

    tasks.push({
      name: 'Collections',
      async task() {
        return execute(collectionsTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  if (options.udfunctions) {
    let udfunctionsTasks = [];
    for (let UDFunction of Object.values(defaultFunctions)) {
      let UDFunctionDefinition = UDFunction;
      if (typeof UDFunctionDefinition === 'function') {
        UDFunctionDefinition = (UDFunctionDefinition as any)({ privateKey: self.private_key || null });
      }

      udfunctionsTasks.push({
        name: `Adding function ${UDFunctionDefinition.name} to [user] role`,
        async task() {
          await delay(300);

          return self.query(
            roleFQLBase.privileges.upsert(BiotaRoleName('user'), {
              resource: q.Function(UDFunctionDefinition.name),
              actions: { call: true },
            }),
          );
          // return self.role(BiotaRoleName("user")).privilege.upsert({
          //   resource: q.Function(UDFunctionDefinition.name),
          //   actions: { call: true },
          // });
        },
        fullError: true,
      });

      udfunctionsTasks.push({
        name: `Adding function ${UDFunctionDefinition.name} to [system] role`,
        async task() {
          await delay(300);
          return self.query(
            roleFQLBase.privileges.upsert(BiotaRoleName('system'), {
              resource: q.Function(UDFunctionDefinition.name),
              actions: { call: true },
            }),
          );
          // return self.role(BiotaRoleName("system")).privilege.upsert({
          //   resource: q.Function(UDFunctionDefinition.name),
          //   actions: { call: true },
          // });
        },
        fullError: true,
      });
    }
    tasks.push({
      name: 'UDFunctions on Roles',
      async task() {
        return execute(udfunctionsTasks, {
          domain: 'Biota.foundation',
          parallel: false,
          indent: 2,
        });
      },
    });
  }

  return execute(tasks, {
    domain: 'Biota.foundation',
  });
}
