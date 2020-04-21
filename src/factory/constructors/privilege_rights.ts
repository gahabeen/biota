import { Expr, query as q } from 'faunadb';
import { TS_2500_YEARS } from '~/consts';
import { PassportUser, PassportSession } from '~/factory/constructors/identity';
import * as helpers from '~/helpers';
import { ActionRuleDefinition, BiotaActionsDefinition } from '~/types/factory/factory.constructors.privilege';
import { FactoryRuleDefinition, FactoryRuleDefinitionPaths } from '~/types/factory/factory.rule';
import { FaunaRef, FaunaRolePrivilegeActions } from '~/types/fauna';

export function PrivilegeRights(
  rights: FactoryRuleDefinition = {},
  immutablePaths?: FactoryRuleDefinitionPaths,
): FaunaRolePrivilegeActions {
  const definition: BiotaActionsDefinition = transformActionsToBooleanRules(rights, immutablePaths);
  const actions = {
    create: { or: [], and: [] }, // doc
    delete: { or: [], and: [] }, // ref
    read: { or: [], and: [] }, // ref
    write: { or: [], and: [] }, // 'oldDoc', 'newDoc'
    history_read: { or: [], and: [] }, // ref
    history_write: { or: [], and: [] }, // 'ref', 'ts', 'action', 'doc'
    unrestricted_read: { or: [], and: [] }, // none  - for indexes
    call: { or: [], and: [] }, // args - for user-defined functions
  };

  function buildAction(actionRule: ActionRuleDefinition | boolean) {
    if (typeof actionRule === 'boolean') {
      return actionRule;
    } else {
      const andRules = actionRule.and || [];
      const orRules = actionRule.or.length > 0 ? q.Or(...actionRule.or) : null;
      if (orRules) andRules.push(orRules);
      if (andRules.length > 1) {
        return q.And(...andRules);
      } else if (andRules.length === 1) {
        return andRules[0];
      } else {
        return false;
      }
    }
  }

  const RefIsSelf = (ref: FaunaRef) => {
    return q.If(q.IsRef(ref), q.Or(q.Equals(ref, PassportUser()), q.Equals(ref, PassportSession())), false);
  };
  const DocOfOwner = (doc: Expr) => {
    return q.Let(
      {
        owner: q.Select(helpers.path('_membership.owner'), doc),
      },
      q.And(q.IsRef(q.Var('owner')), q.Or(q.Equals(q.Var('owner'), PassportUser()), q.Equals(q.Var('owner'), PassportSession()))),
    );
  };
  const DocOfAssignee = (doc: Expr) => {
    return q.Let(
      {
        raw_assignees: q.Select(helpers.path('_membership.assignees'), doc, []),
        assignees: q.If(q.IsArray(q.Var('raw_assignees')), q.Var('raw_assignees'), []),
      },
      q.Not(
        q.IsEmpty(
          q.Filter(
            q.Var('assignees'),
            q.Lambda(
              'assignee',
              q.And(
                q.IsRef(q.Var('assignee')),
                q.Or(q.Equals(q.Var('assignee'), PassportUser()), q.Equals(q.Var('assignee'), PassportSession())),
              ),
            ),
          ),
        ),
      ),
    );
  };
  const changedPathsOnlyAt = (root: string, allowedChangedSubPaths: string[], oldDoc = q.Var('newDoc'), newDoc = q.Var('newDoc')) => {
    return q.Let(
      {
        foundChangedPaths: q.Reduce(
          q.Lambda(
            ['list', 'value'],
            q.Let(
              {
                newDocRoot: q.Select(helpers.path(root), newDoc, {}),
                oldDocRoot: q.Select(helpers.path(root), newDoc, {}),
                key1: q.Select(0, q.Var('value'), null),
                value1: q.Select(1, q.Var('value'), null),
                hasKey2: q.Contains([q.Var('key1')], q.Var('newDocRoot')),
                value2: q.Select(q.Var('key1'), q.Var('newDocRoot'), null),
              },
              q.If(
                q.And(q.Var('hasKey2'), q.Equals(q.Var('value1'), q.Var('value2'))),
                q.Var('list'),
                q.Append([q.Var('key1')], q.Var('list')),
              ),
            ),
          ),
          [],
          q.ToArray(oldDoc),
        ),
      },
      q.IsEmpty(
        q.Filter(
          q.Var('foundChangedPaths'),
          q.Lambda(
            'foundpath',
            q.Not(
              q.IsEmpty(
                q.Filter(allowedChangedSubPaths, q.Lambda('allowedPath', q.Not(q.Equals(q.Var('allowedPath'), q.Var('foundpath'))))),
              ),
            ),
          ),
        ),
      ),
    );
  };
  const PathHasntChanged = (path: string, oldDoc = q.Var('oldDoc'), newDoc = q.Var('newDoc')) => {
    return q.Equals(q.Select(helpers.path(path), oldDoc, {}), q.Select(helpers.path(path), newDoc, {}));
  };
  const PathChangedWith = (path: string, value: any, doc = q.Var('newDoc')) => {
    return q.Equals(q.Select(helpers.path(path), doc, {}), value);
  };
  const documentIsNotExpired = (doc: Expr) => {
    return q.GTE(q.Select(helpers.path('_validity.expires_at'), doc, q.ToTime(TS_2500_YEARS)), q.Now());
  };
  const documentIsExpired = (doc: Expr) => {
    return q.Not(documentIsNotExpired(doc));
  };
  const documentIsNotDeleted = (doc: Expr) => {
    return q.Equals(q.Select(helpers.path('_validity.deleted'), doc, false), false);
  };
  const documentIsDeleted = (doc: Expr) => {
    return q.Not(documentIsNotDeleted(doc));
  };
  const documentIsAvailable = (doc: Expr) => {
    return q.And(documentIsNotExpired(doc), documentIsNotDeleted(doc));
  };

  /**
   * immutablePaths
   */

  const addImmutablePaths = (identityCheck: Expr, paths: string[]) => {
    for (const immutablePath of paths) {
      actions.write.or.push(
        q.And(
          identityCheck,
          q.Equals(q.Select(helpers.path(immutablePath), q.Var('oldDoc'), {}), q.Select(helpers.path(immutablePath), q.Var('newDoc'), {})),
        ),
      );
    }
  };

  if (Array.isArray(definition.self.immutablePaths)) {
    addImmutablePaths(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), definition.self.immutablePaths);
  }

  if (Array.isArray(definition.owner.immutablePaths)) {
    addImmutablePaths(DocOfOwner(q.Var('oldDoc')), definition.owner.immutablePaths);
  }

  if (Array.isArray(definition.assignee.immutablePaths)) {
    addImmutablePaths(DocOfAssignee(q.Var('oldDoc')), definition.self.immutablePaths);
  }

  /**
   * get
   */
  const getBaseRules = [documentIsAvailable(q.Get(q.Var('ref')))];

  if (definition.self.get) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getBaseRules));
  }

  if (definition.owner.get) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getBaseRules));
  }

  if (definition.assignee.get) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getBaseRules));
  }

  /**
   * getWhenDeleted
   */
  const getWhenDeletedBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (definition.self.getWhenDeleted) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getWhenDeletedBaseRules));
  }

  if (definition.owner.getWhenDeleted) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getWhenDeletedBaseRules));
  }

  if (definition.assignee.getWhenDeleted) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getWhenDeletedBaseRules));
  }

  /**
   * getWhenExpired
   */
  const getWhenExpiredBaseRules = [documentIsExpired(q.Get(q.Var('ref')))];

  if (definition.self.getWhenExpired) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getWhenExpiredBaseRules));
  }

  if (definition.owner.getWhenExpired) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getWhenExpiredBaseRules));
  }

  if (definition.assignee.getWhenExpired) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getWhenExpiredBaseRules));
  }

  /**
   * getHistory
   */
  const getHistoryBaseRules = [documentIsAvailable(q.Get(q.Var('ref')))];

  if (definition.self.getHistory) {
    actions.history_read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getHistoryBaseRules));
  }

  if (definition.owner.getHistory) {
    actions.history_read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getHistoryBaseRules));
  }

  if (definition.assignee.getHistory) {
    actions.history_read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getHistoryBaseRules));
  }

  /**
   * getHistoryWhenDeleted
   */
  const getHistoryWhenDeletedBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (definition.self.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getHistoryWhenDeletedBaseRules));
  }

  if (definition.owner.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getHistoryWhenDeletedBaseRules));
  }

  if (definition.assignee.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getHistoryWhenDeletedBaseRules));
  }

  /**
   * getHistoryWhenExpired
   */
  const getHistoryWhenExpiredBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (definition.self.getHistoryWhenExpired) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getHistoryWhenExpiredBaseRules));
  }

  if (definition.owner.getHistoryWhenExpired) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getHistoryWhenExpiredBaseRules));
  }

  if (definition.assignee.getHistoryWhenExpired) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getHistoryWhenExpiredBaseRules));
  }

  /**
   * insert
   */
  const insertBaseRules = [
    PathHasntChanged('_activity', {}, q.Var('doc')),
    PathHasntChanged('_auth', {}, q.Var('doc')),
    q.And(
      changedPathsOnlyAt('_activity', ['inserted_by', 'inserted_at'], {}, q.Var('doc')),
      q.Or(
        PathChangedWith('_activity.inserted_by', PassportUser(), q.Var('doc')),
        PathChangedWith('_activity.inserted_at', q.Now(), q.Var('doc')),
      ),
    ),
    q.And(
      changedPathsOnlyAt('_membership', ['owner'], {}, q.Var('doc')),
      PathChangedWith('_membership.owner', PassportUser(), q.Var('doc')),
    ),
  ];

  if (definition.self.insert) {
    actions.create.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('doc'))), ...insertBaseRules));
  }

  if (definition.owner.insert) {
    actions.create.or.push(q.And(DocOfOwner(q.Var('doc')), ...insertBaseRules));
  }

  if (definition.assignee.insert) {
    actions.create.or.push(q.And(DocOfAssignee(q.Var('doc')), ...insertBaseRules));
  }

  /**
   * insertHistory
   */

  // if (definition.self.insertHistory) {
  //   actions.history_write.and.push(RefIsSelf(q.Select('ref', q.Var('doc'), null)));
  // }

  /**
   * update
   */

  const updateBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['updated_by', 'updated_at']),
      q.Or(PathChangedWith('_activity.updated_by', PassportUser()), PathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (definition.self.update) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateBaseRules));
  }

  if (definition.owner.update) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...updateBaseRules));
  }

  if (definition.assignee.update) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...updateBaseRules));
  }

  /**
   * updateWhenDeleted
   */

  const updateWhenDeletedBaseRules = [
    documentIsDeleted(q.Var('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['updated_by', 'updated_at']),
      q.Or(PathChangedWith('_activity.updated_by', PassportUser()), PathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (definition.self.updateWhenDeleted) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateWhenDeletedBaseRules));
  }

  if (definition.owner.updateWhenDeleted) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...updateWhenDeletedBaseRules));
  }

  if (definition.assignee.updateWhenDeleted) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...updateWhenDeletedBaseRules));
  }

  /**
   * updateWhenDeleted
   */

  const updateWhenExpiredBaseRules = [
    documentIsExpired(q.Var('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['updated_by', 'updated_at']),
      q.Or(PathChangedWith('_activity.updated_by', PassportUser()), PathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (definition.self.updateWhenExpired) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateWhenExpiredBaseRules));
  }

  if (definition.owner.updateWhenExpired) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...updateWhenExpiredBaseRules));
  }

  if (definition.assignee.updateWhenExpired) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...updateWhenExpiredBaseRules));
  }

  /**
   * replace
   */

  const replaceBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['replaced_by', 'replaced_at']),
      q.Or(PathChangedWith('_activity.replaced_by', PassportUser()), PathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (definition.self.replace) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceBaseRules));
  }

  if (definition.owner.replace) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...replaceBaseRules));
  }

  if (definition.assignee.replace) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...replaceBaseRules));
  }

  /**
   * replaceWhenDeleted
   */

  const replaceWhenDeletedBaseRules = [
    documentIsDeleted(q.Var('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['replaced_by', 'replaced_at']),
      q.Or(PathChangedWith('_activity.replaced_by', PassportUser()), PathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (definition.self.replaceWhenDeleted) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceWhenDeletedBaseRules));
  }

  if (definition.owner.replaceWhenDeleted) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...replaceWhenDeletedBaseRules));
  }

  if (definition.assignee.replaceWhenDeleted) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...replaceWhenDeletedBaseRules));
  }

  /**
   * replaceWhenDeleted
   */

  const replaceWhenExpiredBaseRules = [
    documentIsExpired(q.Var('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['replaced_by', 'replaced_at']),
      q.Or(PathChangedWith('_activity.replaced_by', PassportUser()), PathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (definition.self.replaceWhenExpired) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceWhenExpiredBaseRules));
  }

  if (definition.owner.replaceWhenExpired) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...replaceWhenExpiredBaseRules));
  }

  if (definition.assignee.replaceWhenExpired) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...replaceWhenExpiredBaseRules));
  }

  /**
   * delete
   */

  const deleteBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['deleted_by', 'deleted_at']),
      q.Or(PathChangedWith('_activity.deleted_by', PassportUser()), PathChangedWith('_activity.deleted_at', q.Now())),
    ),
    q.And(
      changedPathsOnlyAt('_validity', ['deleted']),
      q.Or(PathChangedWith('_validity.deleted', true), PathChangedWith('_validity.deleted', false)),
    ),
  ];

  if (definition.self.delete) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...deleteBaseRules));
  }

  if (definition.owner.delete) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...deleteBaseRules));
  }

  if (definition.assignee.delete) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...deleteBaseRules));
  }

  /**
   * forget
   */

  const forgetBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['forgotten_by', 'forgotten_at']),
      q.Or(PathChangedWith('_activity.forgotten_by', PassportUser()), PathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (definition.self.forget) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetBaseRules));
  }

  if (definition.owner.forget) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...forgetBaseRules));
  }

  if (definition.assignee.forget) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...forgetBaseRules));
  }

  /**
   * forgetWhenDeleted
   */

  const forgetWhenDeletedBaseRules = [
    documentIsDeleted(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['forgotten_by', 'forgotten_at']),
      q.Or(PathChangedWith('_activity.forgotten_by', PassportUser()), PathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (definition.self.forgetWhenDeleted) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetWhenDeletedBaseRules));
  }

  if (definition.owner.forgetWhenDeleted) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...forgetWhenDeletedBaseRules));
  }

  if (definition.assignee.forgetWhenDeleted) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...forgetWhenDeletedBaseRules));
  }

  /**
   * forgetWhenDeleted
   */

  const forgetWhenExpiredBaseRules = [
    documentIsExpired(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['forgotten_by', 'forgotten_at']),
      q.Or(PathChangedWith('_activity.forgotten_by', PassportUser()), PathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (definition.self.forgetWhenExpired) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetWhenExpiredBaseRules));
  }

  if (definition.owner.forgetWhenExpired) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...forgetWhenExpiredBaseRules));
  }

  if (definition.assignee.forgetWhenExpired) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...forgetWhenExpiredBaseRules));
  }

  /**
   * expire
   */

  const expireBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['expiration_changed_by', 'expiration_changed_at']),
      q.Or(PathChangedWith('_activity.expiration_changed_by', PassportUser()), PathChangedWith('_activity.expiration_changed_at', q.Now())),
    ),
    changedPathsOnlyAt('_validity', ['expires_at']),
  ];

  if (definition.self.expire) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...expireBaseRules));
  }

  if (definition.owner.expire) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...expireBaseRules));
  }

  if (definition.assignee.expire) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...expireBaseRules));
  }

  /**
   * restore
   */

  const restoreBaseRules = [
    PathHasntChanged('_auth'),
    PathHasntChanged('_membership'),
    q.And(
      changedPathsOnlyAt('_activity', ['restored_by', 'restored_at']),
      q.Or(PathChangedWith('_activity.restored_by', PassportUser()), PathChangedWith('_activity.restored_at', q.Now())),
    ),
    changedPathsOnlyAt('_validity', ['deleted', 'expires_at']),
  ];

  if (definition.self.restore) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...restoreBaseRules));
  }

  if (definition.owner.restore) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...restoreBaseRules));
  }

  if (definition.assignee.restore) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...restoreBaseRules));
  }

  /**
   * remember
   */

  const rememberBaseRules = [
    PathHasntChanged('_auth'),
    PathHasntChanged('_membership'),
    PathHasntChanged('_validity'),
    q.And(
      changedPathsOnlyAt('_activity', ['remembered_by', 'remembered_at']),
      q.Or(PathChangedWith('_activity.remembered_by', PassportUser()), PathChangedWith('_activity.remembered_at', q.Now())),
    ),
  ];

  if (definition.self.restore) {
    actions.history_write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...rememberBaseRules));
  }

  if (definition.owner.restore) {
    actions.history_write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...rememberBaseRules));
  }

  if (definition.assignee.restore) {
    actions.history_write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...rememberBaseRules));
  }

  /**
   * set/remove Owner
   */

  const setRemoveOwnerBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    q.And(
      changedPathsOnlyAt('_activity', ['owner_changed_by', 'owner_changed_at']),
      q.Or(PathChangedWith('_activity.owner_changed_by', PassportUser()), PathChangedWith('_activity.owner_changed_at', q.Now())),
    ),
  ];

  const setOwnerBaseRules = [
    q.And(changedPathsOnlyAt('_membership', ['owner']), q.IsRef(q.Select(helpers.path('_membership.owner'), q.Var('newDoc'), null))),
  ];

  if (definition.self.setOwner) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveOwnerBaseRules, ...setOwnerBaseRules));
  }

  if (definition.owner.setOwner) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...setOwnerBaseRules));
  }

  if (definition.assignee.setOwner) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...setOwnerBaseRules));
  }

  const removeOwnerBaseRules = [
    q.And(
      changedPathsOnlyAt('_membership', ['owner']),
      q.IsNull(q.Select(helpers.path('_membership.owner'), q.Var('newDoc'), 'this is not null')),
    ),
  ];

  if (definition.self.removeOwner) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveOwnerBaseRules, ...removeOwnerBaseRules));
  }

  if (definition.owner.removeOwner) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...removeOwnerBaseRules));
  }

  if (definition.assignee.removeOwner) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...removeOwnerBaseRules));
  }

  /**
   * set/remove Assignee
   */

  const setRemoveAssigneeBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    q.And(
      changedPathsOnlyAt('_activity', ['assignees_changed_by', 'assignees_changed_at']),
      q.Or(PathChangedWith('_activity.assignees_changed_by', PassportUser()), PathChangedWith('_activity.assignees_changed_at', q.Now())),
    ),
  ];

  const setAssigneeBaseRules = [
    q.And(
      changedPathsOnlyAt('_membership', ['assignees']),
      q.Equals(
        q.Count(
          q.Difference(
            q.Select(helpers.path('_membership.assignees'), q.Var('oldDoc'), []),
            q.Select(helpers.path('_membership.assignees'), q.Var('newDoc'), []),
          ),
        ),
        0,
      ),
    ),
  ];

  if (definition.self.setAssignee) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAssigneeBaseRules, ...setAssigneeBaseRules));
  }

  if (definition.owner.setAssignee) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...setAssigneeBaseRules));
  }

  if (definition.assignee.setAssignee) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...setAssigneeBaseRules));
  }

  const removeAssigneeBaseRules = [
    q.And(
      changedPathsOnlyAt('_membership', ['assignees']),
      q.Equals(
        q.Count(
          q.Difference(
            q.Select(helpers.path('_membership.assignees'), q.Var('newDoc'), []),
            q.Select(helpers.path('_membership.assignees'), q.Var('oldDoc'), []),
          ),
        ),
        0,
      ),
    ),
  ];

  if (definition.self.removeAssignee) {
    actions.write.or.push(
      q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAssigneeBaseRules, ...removeAssigneeBaseRules),
    );
  }

  if (definition.owner.removeAssignee) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...removeAssigneeBaseRules));
  }

  if (definition.assignee.removeAssignee) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...removeAssigneeBaseRules));
  }

  /**
   * set/remove Role
   */

  const setRemoveRoleBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_auth'),
    PathHasntChanged('_validity'),
    q.And(
      changedPathsOnlyAt('_activity', ['roles_changed_by', 'roles_changed_at']),
      q.Or(PathChangedWith('_activity.roles_changed_by', PassportUser()), PathChangedWith('_activity.roles_changed_at', q.Now())),
    ),
  ];

  const setRoleBaseRules = [
    q.And(
      changedPathsOnlyAt('_membership', ['roles']),
      q.Equals(
        q.Count(
          q.Difference(
            q.Select(helpers.path('_membership.roles'), q.Var('oldDoc'), []),
            q.Select(helpers.path('_membership.roles'), q.Var('newDoc'), []),
          ),
        ),
        0,
      ),
    ),
  ];

  if (definition.self.setRole) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveRoleBaseRules, ...setRoleBaseRules));
  }

  if (definition.owner.setRole) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...setRoleBaseRules));
  }

  if (definition.assignee.setRole) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...setRoleBaseRules));
  }

  const removeRoleBaseRules = [
    q.And(
      changedPathsOnlyAt('_membership', ['roles']),
      q.Equals(
        q.Count(
          q.Difference(
            q.Select(helpers.path('_membership.roles'), q.Var('newDoc'), []),
            q.Select(helpers.path('_membership.roles'), q.Var('oldDoc'), []),
          ),
        ),
        0,
      ),
    ),
  ];

  if (definition.self.removeRole) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveRoleBaseRules, ...removeRoleBaseRules));
  }

  if (definition.owner.removeRole) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...removeRoleBaseRules));
  }

  if (definition.assignee.removeRole) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...removeRoleBaseRules));
  }

  /**
   * set/remove Auth Email
   */

  const setRemoveAuthEmailBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_membership'),
    PathHasntChanged('_validity'),
    q.And(
      changedPathsOnlyAt('_activity', ['auth_email_changed_by', 'auth_email_changed_at']),
      q.Or(PathChangedWith('_activity.auth_email_changed_by', PassportUser()), PathChangedWith('_activity.auth_email_changed_at', q.Now())),
    ),
  ];

  const setAuthEmailBaseRules = [
    q.And(changedPathsOnlyAt('_auth', ['email']), q.IsRef(q.Select(helpers.path('_auth.email'), q.Var('newDoc'), null))),
  ];

  if (definition.self.setAuthEmail) {
    actions.write.or.push(
      q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthEmailBaseRules, ...setAuthEmailBaseRules),
    );
  }

  if (definition.owner.setAuthEmail) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...setAuthEmailBaseRules));
  }

  if (definition.assignee.setAuthEmail) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...setAuthEmailBaseRules));
  }

  const removeAuthEmailBaseRules = [
    q.And(changedPathsOnlyAt('_auth', ['email']), q.IsNull(q.Select(helpers.path('_auth.email'), q.Var('newDoc'), 'this is not null'))),
  ];

  if (definition.self.removeAuthEmail) {
    actions.write.or.push(
      q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthEmailBaseRules, ...removeAuthEmailBaseRules),
    );
  }

  if (definition.owner.removeAuthEmail) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...removeAuthEmailBaseRules));
  }

  if (definition.assignee.removeAuthEmail) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...removeAuthEmailBaseRules));
  }

  /**
   * set/remove Auth Account
   */

  const setRemoveAuthAccountBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    PathHasntChanged('_membership'),
    PathHasntChanged('_validity'),
    q.And(
      changedPathsOnlyAt('_activity', ['auth_accounts_changed_by', 'auth_accounts_changed_at']),
      q.Or(
        PathChangedWith('_activity.auth_accounts_changed_by', PassportUser()),
        PathChangedWith('_activity.auth_accounts_changed_at', q.Now()),
      ),
    ),
  ];

  const setAuthAccountBaseRules = [
    q.And(
      changedPathsOnlyAt('_auth', ['accounts']),
      q.Equals(
        q.Count(
          q.Difference(
            q.Select(helpers.path('_auth.accounts'), q.Var('oldDoc'), []),
            q.Select(helpers.path('_auth.accounts'), q.Var('newDoc'), []),
          ),
        ),
        0,
      ),
    ),
  ];

  if (definition.self.setAuthEmail) {
    actions.write.or.push(
      q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthAccountBaseRules, ...setAuthAccountBaseRules),
    );
  }

  if (definition.owner.setAuthEmail) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...setAuthAccountBaseRules));
  }

  if (definition.assignee.setAuthEmail) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...setAuthAccountBaseRules));
  }

  const removeAuthAccountBaseRules = [
    q.And(
      changedPathsOnlyAt('_auth', ['accounts']),
      q.Equals(
        q.Count(
          q.Difference(
            q.Select(helpers.path('_auth.accounts'), q.Var('newDoc'), []),
            q.Select(helpers.path('_auth.accounts'), q.Var('oldDoc'), []),
          ),
        ),
        0,
      ),
    ),
  ];

  if (definition.self.removeAuthEmail) {
    actions.write.or.push(
      q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthAccountBaseRules, ...removeAuthAccountBaseRules),
    );
  }

  if (definition.owner.removeAuthEmail) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...removeAuthAccountBaseRules));
  }

  if (definition.assignee.removeAuthEmail) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...removeAuthAccountBaseRules));
  }

  return Object.assign(
    {
      create: q.Query(q.Lambda(['doc'], buildAction(actions.create))),
      delete: q.Query(q.Lambda(['ref'], buildAction(actions.delete))),
      read: q.Query(q.Lambda(['ref'], buildAction(actions.read))),
      write: q.Query(q.Lambda(['oldDoc', 'newDoc'], buildAction(actions.write))),
      history_read: q.Query(q.Lambda(['ref'], buildAction(actions.history_read))),
      history_write: q.Query(q.Lambda(['ref', 'ts', 'action', 'doc'], buildAction(actions.history_write))),
      unrestricted_read: q.Query(q.Lambda(['_'], buildAction(actions.unrestricted_read))),
      call: q.Query(q.Lambda(['args'], buildAction(actions.call))),
    },
    definition.global,
  );
}

function transformActionsToBooleanRules(rules: FactoryRuleDefinition = {}, paths: FactoryRuleDefinitionPaths = {}): BiotaActionsDefinition {
  // tslint:disable-next-line: prefer-const
  let defaultRuleDefinition: FactoryRuleDefinition<boolean> = {
    immutablePaths: [],
    get: false,
    getHistory: false,
    getHistoryWhenDeleted: false,
    getHistoryWhenExpired: false,
    insert: false,
    insertHistory: false,
    update: false,
    replace: false,
    delete: false,
    getWhenDeleted: false,
    updateWhenDeleted: false,
    replaceWhenDeleted: false,
    forgetWhenDeleted: false,
    expire: false,
    getWhenExpired: false,
    updateWhenExpired: false,
    replaceWhenExpired: false,
    forgetWhenExpired: false,
    forget: false,
    restore: false,
    remember: false,
    setOwner: false,
    removeOwner: false,
    setAssignee: false,
    removeAssignee: false,
    setRole: false,
    removeRole: false,
    setAuthEmail: false,
    removeAuthEmail: false,
    setAuthAccount: false,
    removeAuthAccount: false,
  };
  const actions: BiotaActionsDefinition = {
    global: {},
    self: { ...defaultRuleDefinition },
    owner: { ...defaultRuleDefinition },
    assignee: { ...defaultRuleDefinition },
    admin: Object.keys(defaultRuleDefinition).reduce((adminActions, adminAction) => {
      if (typeof defaultRuleDefinition[adminAction] === 'boolean') {
        adminActions[adminAction] = true;
      } else {
        adminActions[adminAction] = defaultRuleDefinition[adminAction];
      }
      return adminActions;
    }, {}),
  };
  for (const key of Object.keys(rules)) {
    if (Array.isArray(rules[key])) {
      if (rules[key].includes('self')) actions.self[key] = true;
      if (rules[key].includes('owner')) actions.owner[key] = true;
      if (rules[key].includes('assignee')) actions.assignee[key] = true;
      if (rules[key].includes('admin')) actions.admin[key] = true;
    } else if (typeof rules[key] === 'boolean') {
      actions.global[key] = rules[key];
    }
  }
  if (((paths.self && paths.self.immutablePaths) || []).length > 0) {
    actions.self.immutablePaths = paths.self.immutablePaths;
  }
  if (((paths.owner && paths.owner.immutablePaths) || []).length > 0) {
    actions.owner.immutablePaths = paths.owner.immutablePaths;
  }
  if (((paths.assignee && paths.assignee.immutablePaths) || []).length > 0) {
    actions.assignee.immutablePaths = paths.assignee.immutablePaths;
  }
  return actions;
}
