import { Expr, query as q } from 'faunadb';
import { TS_2500_YEARS } from '~/consts';
import { Passport } from '~/factory/constructors/identity';
import * as helpers from '~/helpers';
import { ActionRuleDefinition, BiotaActionsDefinition } from '~/types/factory/factory.constructors.privilege';
import { FactoryRuleDefinition, FactoryRuleDefinitionPaths } from '~/types/factory/factory.rule';
import { FaunaRef, FaunaRolePrivilegeActions } from '~/types/fauna';

export function BiotaRule(name: string, rule: Expr) {
  return q.Let(
    {
      $BiotaRule: true,
      name,
      rule,
    },
    q.Var('rule'),
  );
}

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
      const context = {
        $BiotaRuleContext: true,
        passport: Passport(),
        passportUser: q.Select('user', q.Var('passport'), null),
        passportSession: q.Select('session', q.Var('passport'), null),
      };
      const andRules = actionRule.and || [];
      const orRules = actionRule.or.length > 0 ? q.Or(...actionRule.or) : null;
      if (orRules) andRules.push(orRules);
      if (andRules.length > 1) {
        return q.Let(context, q.And(...andRules));
      } else if (andRules.length === 1) {
        return q.Let(context, andRules[0]);
      } else {
        return false;
      }
    }
  }

  const referenceIsSelf = (ref: FaunaRef) => {
    return BiotaRule(
      'reference_is_self',
      q.If(q.IsRef(ref), q.Or(q.Equals(ref, q.Var('passportUser')), q.Equals(ref, q.Var('passportSession'))), false),
    );
  };
  const documentOfOwner = (doc: Expr) => {
    return BiotaRule(
      'document_is_owner',
      q.Let(
        {
          owner: q.Select(helpers.path('_membership.owner'), doc, null),
        },

        q.And(
          q.IsRef(q.Var('owner')),
          q.Or(q.Equals(q.Var('owner'), q.Var('passportUser')), q.Equals(q.Var('owner'), q.Var('passportSession'))),
        ),
      ),
    );
  };
  const documentOfAssignee = (doc: Expr) => {
    return BiotaRule(
      'document_of_assignee',
      q.Let(
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
                  q.Or(q.Equals(q.Var('assignee'), q.Var('passportUser')), q.Equals(q.Var('assignee'), q.Var('passportSession'))),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  };
  const documentIsNotExpired = (doc: Expr) => {
    return BiotaRule(
      'document_is_not_expired',
      q.GTE(q.Select(helpers.path('_validity.expires_at'), doc, q.ToTime(TS_2500_YEARS)), q.Now()),
    );
  };
  const documentIsExpired = (doc: Expr) => {
    return BiotaRule('document_is_expired', q.Not(documentIsNotExpired(doc)));
  };
  const documentIsNotDeleted = (doc: Expr) => {
    return BiotaRule('document_is_not_deleted', q.Equals(q.Select(helpers.path('_validity.deleted'), doc, false), false));
  };
  const documentIsDeleted = (doc: Expr) => {
    return BiotaRule('document_is_not_deleted', q.Not(documentIsNotDeleted(doc)));
  };
  const documentIsAvailable = (doc: Expr) => {
    return BiotaRule('document_is_available', q.And(documentIsNotExpired(doc), documentIsNotDeleted(doc)));
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
  const pathHasntChanged = (path: string, oldDoc = q.Var('oldDoc'), newDoc = q.Var('newDoc')) => {
    return BiotaRule(
      'path_hasnt_changed_at_' + path,
      q.Equals(q.Select(helpers.path(path), oldDoc, {}), q.Select(helpers.path(path), newDoc, {})),
    );
  };
  const pathChangedWith = (path: string, value: any, doc = q.Var('newDoc')) => {
    return BiotaRule('path_changed_at_' + path, q.Equals(q.Select(helpers.path(path), doc, {}), value));
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
    addImmutablePaths(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), definition.self.immutablePaths);
  }

  if (Array.isArray(definition.owner.immutablePaths)) {
    addImmutablePaths(documentOfOwner(q.Var('oldDoc')), definition.owner.immutablePaths);
  }

  if (Array.isArray(definition.assignee.immutablePaths)) {
    addImmutablePaths(documentOfAssignee(q.Var('oldDoc')), definition.self.immutablePaths);
  }

  /**
   * get
   */
  const getBaseRules = [documentIsAvailable(q.Get(q.Var('ref')))];

  if (definition.self.get) {
    actions.read.or.push(BiotaRule('get_as_self', q.And(referenceIsSelf(q.Var('ref')), ...getBaseRules)));
  }

  if (definition.owner.get) {
    actions.read.or.push(BiotaRule('get_as_owner', q.And(documentOfOwner(q.Get(q.Var('ref'))), ...getBaseRules)));
  }

  if (definition.assignee.get) {
    actions.read.or.push(BiotaRule('get_as_assignee', q.And(documentOfAssignee(q.Get(q.Var('ref'))), ...getBaseRules)));
  }

  /**
   * getWhenDeleted
   */
  const getWhenDeletedBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (definition.self.getWhenDeleted) {
    actions.read.or.push(q.And(referenceIsSelf(q.Var('ref')), ...getWhenDeletedBaseRules));
  }

  if (definition.owner.getWhenDeleted) {
    actions.read.or.push(q.And(documentOfOwner(q.Get(q.Var('ref'))), ...getWhenDeletedBaseRules));
  }

  if (definition.assignee.getWhenDeleted) {
    actions.read.or.push(q.And(documentOfAssignee(q.Get(q.Var('ref'))), ...getWhenDeletedBaseRules));
  }

  /**
   * getWhenExpired
   */
  const getWhenExpiredBaseRules = [documentIsExpired(q.Get(q.Var('ref')))];

  if (definition.self.getWhenExpired) {
    actions.read.or.push(q.And(referenceIsSelf(q.Var('ref')), ...getWhenExpiredBaseRules));
  }

  if (definition.owner.getWhenExpired) {
    actions.read.or.push(q.And(documentOfOwner(q.Get(q.Var('ref'))), ...getWhenExpiredBaseRules));
  }

  if (definition.assignee.getWhenExpired) {
    actions.read.or.push(q.And(documentOfAssignee(q.Get(q.Var('ref'))), ...getWhenExpiredBaseRules));
  }

  /**
   * getHistory
   */
  const getHistoryBaseRules = [documentIsAvailable(q.Get(q.Var('ref')))];

  if (definition.self.getHistory) {
    actions.history_read.or.push(q.And(referenceIsSelf(q.Var('ref')), ...getHistoryBaseRules));
  }

  if (definition.owner.getHistory) {
    actions.history_read.or.push(q.And(documentOfOwner(q.Get(q.Var('ref'))), ...getHistoryBaseRules));
  }

  if (definition.assignee.getHistory) {
    actions.history_read.or.push(q.And(documentOfAssignee(q.Get(q.Var('ref'))), ...getHistoryBaseRules));
  }

  /**
   * getHistoryWhenDeleted
   */
  const getHistoryWhenDeletedBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (definition.self.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(referenceIsSelf(q.Var('ref')), ...getHistoryWhenDeletedBaseRules));
  }

  if (definition.owner.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(documentOfOwner(q.Get(q.Var('ref'))), ...getHistoryWhenDeletedBaseRules));
  }

  if (definition.assignee.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(documentOfAssignee(q.Get(q.Var('ref'))), ...getHistoryWhenDeletedBaseRules));
  }

  /**
   * getHistoryWhenExpired
   */
  const getHistoryWhenExpiredBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (definition.self.getHistoryWhenExpired) {
    actions.read.or.push(q.And(referenceIsSelf(q.Var('ref')), ...getHistoryWhenExpiredBaseRules));
  }

  if (definition.owner.getHistoryWhenExpired) {
    actions.read.or.push(q.And(documentOfOwner(q.Get(q.Var('ref'))), ...getHistoryWhenExpiredBaseRules));
  }

  if (definition.assignee.getHistoryWhenExpired) {
    actions.read.or.push(q.And(documentOfAssignee(q.Get(q.Var('ref'))), ...getHistoryWhenExpiredBaseRules));
  }

  /**
   * insert
   */
  const insertBaseRules = [
    pathHasntChanged('_activity', {}, q.Var('doc')),
    pathHasntChanged('_auth', {}, q.Var('doc')),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_inserted_by_or_at',
        changedPathsOnlyAt('_activity', ['inserted_by', 'inserted_at'], {}, q.Var('doc')),
      ),
      q.Or(
        pathChangedWith('_activity.inserted_by', q.Var('passportUser'), q.Var('doc')),
        pathChangedWith('_activity.inserted_at', q.Now(), q.Var('doc')),
      ),
    ),
    q.And(
      BiotaRule('path_changed_only_at__membership_owner', changedPathsOnlyAt('_membership', ['owner'], {}, q.Var('doc'))),
      pathChangedWith('_membership.owner', q.Var('passportUser'), q.Var('doc')),
    ),
  ];

  if (definition.self.insert) {
    actions.create.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('doc'))), ...insertBaseRules));
  }

  if (definition.owner.insert) {
    actions.create.or.push(q.And(documentOfOwner(q.Var('doc')), ...insertBaseRules));
  }

  if (definition.assignee.insert) {
    actions.create.or.push(q.And(documentOfAssignee(q.Var('doc')), ...insertBaseRules));
  }

  /**
   * insertHistory
   */

  // if (definition.self.insertHistory) {
  //   actions.history_write.and.push(referenceIsSelf(q.Select('ref', q.Var('doc'), null)));
  // }

  /**
   * update
   */

  const updateBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_updated_by_or_at', changedPathsOnlyAt('_activity', ['updated_by', 'updated_at'])),
      q.Or(pathChangedWith('_activity.updated_by', q.Var('passportUser')), pathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (definition.self.update) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateBaseRules));
  }

  if (definition.owner.update) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...updateBaseRules));
  }

  if (definition.assignee.update) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...updateBaseRules));
  }

  /**
   * updateWhenDeleted
   */

  const updateWhenDeletedBaseRules = [
    documentIsDeleted(q.Var('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_updated_by_or_at', changedPathsOnlyAt('_activity', ['updated_by', 'updated_at'])),
      q.Or(pathChangedWith('_activity.updated_by', q.Var('passportUser')), pathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (definition.self.updateWhenDeleted) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateWhenDeletedBaseRules));
  }

  if (definition.owner.updateWhenDeleted) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...updateWhenDeletedBaseRules));
  }

  if (definition.assignee.updateWhenDeleted) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...updateWhenDeletedBaseRules));
  }

  /**
   * updateWhenDeleted
   */

  const updateWhenExpiredBaseRules = [
    documentIsExpired(q.Var('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_updated_by_or_at', changedPathsOnlyAt('_activity', ['updated_by', 'updated_at'])),
      q.Or(pathChangedWith('_activity.updated_by', q.Var('passportUser')), pathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (definition.self.updateWhenExpired) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateWhenExpiredBaseRules));
  }

  if (definition.owner.updateWhenExpired) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...updateWhenExpiredBaseRules));
  }

  if (definition.assignee.updateWhenExpired) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...updateWhenExpiredBaseRules));
  }

  /**
   * replace
   */

  const replaceBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_updated_by_or_at', changedPathsOnlyAt('_activity', ['replaced_by', 'replaced_at'])),
      q.Or(pathChangedWith('_activity.replaced_by', q.Var('passportUser')), pathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (definition.self.replace) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceBaseRules));
  }

  if (definition.owner.replace) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...replaceBaseRules));
  }

  if (definition.assignee.replace) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...replaceBaseRules));
  }

  /**
   * replaceWhenDeleted
   */

  const replaceWhenDeletedBaseRules = [
    documentIsDeleted(q.Var('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_replaced_by_or_at', changedPathsOnlyAt('_activity', ['replaced_by', 'replaced_at'])),
      q.Or(pathChangedWith('_activity.replaced_by', q.Var('passportUser')), pathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (definition.self.replaceWhenDeleted) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceWhenDeletedBaseRules));
  }

  if (definition.owner.replaceWhenDeleted) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...replaceWhenDeletedBaseRules));
  }

  if (definition.assignee.replaceWhenDeleted) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...replaceWhenDeletedBaseRules));
  }

  /**
   * replaceWhenDeleted
   */

  const replaceWhenExpiredBaseRules = [
    documentIsExpired(q.Var('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_replaced_by_or_at', changedPathsOnlyAt('_activity', ['replaced_by', 'replaced_at'])),
      q.Or(pathChangedWith('_activity.replaced_by', q.Var('passportUser')), pathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (definition.self.replaceWhenExpired) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceWhenExpiredBaseRules));
  }

  if (definition.owner.replaceWhenExpired) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...replaceWhenExpiredBaseRules));
  }

  if (definition.assignee.replaceWhenExpired) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...replaceWhenExpiredBaseRules));
  }

  /**
   * delete
   */

  const deleteBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_deleted_by_or_at', changedPathsOnlyAt('_activity', ['deleted_by', 'deleted_at'])),
      q.Or(pathChangedWith('_activity.deleted_by', q.Var('passportUser')), pathChangedWith('_activity.deleted_at', q.Now())),
    ),
    q.And(
      BiotaRule('path_changed_only_at__validity_deleted', changedPathsOnlyAt('_validity', ['deleted'])),
      q.Or(pathChangedWith('_validity.deleted', true), pathChangedWith('_validity.deleted', false)),
    ),
  ];

  if (definition.self.delete) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...deleteBaseRules));
  }

  if (definition.owner.delete) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...deleteBaseRules));
  }

  if (definition.assignee.delete) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...deleteBaseRules));
  }

  /**
   * forget
   */

  const forgetBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_forgotten_by_or_at', changedPathsOnlyAt('_activity', ['forgotten_by', 'forgotten_at'])),
      q.Or(pathChangedWith('_activity.forgotten_by', q.Var('passportUser')), pathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (definition.self.forget) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetBaseRules));
  }

  if (definition.owner.forget) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...forgetBaseRules));
  }

  if (definition.assignee.forget) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...forgetBaseRules));
  }

  /**
   * forgetWhenDeleted
   */

  const forgetWhenDeletedBaseRules = [
    documentIsDeleted(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_forgotten_by_or_at', changedPathsOnlyAt('_activity', ['forgotten_by', 'forgotten_at'])),
      q.Or(pathChangedWith('_activity.forgotten_by', q.Var('passportUser')), pathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (definition.self.forgetWhenDeleted) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetWhenDeletedBaseRules));
  }

  if (definition.owner.forgetWhenDeleted) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...forgetWhenDeletedBaseRules));
  }

  if (definition.assignee.forgetWhenDeleted) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...forgetWhenDeletedBaseRules));
  }

  /**
   * forgetWhenDeleted
   */

  const forgetWhenExpiredBaseRules = [
    documentIsExpired(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule('path_changed_only_at__activity_forgotten_by_or_at', changedPathsOnlyAt('_activity', ['forgotten_by', 'forgotten_at'])),
      q.Or(pathChangedWith('_activity.forgotten_by', q.Var('passportUser')), pathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (definition.self.forgetWhenExpired) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetWhenExpiredBaseRules));
  }

  if (definition.owner.forgetWhenExpired) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...forgetWhenExpiredBaseRules));
  }

  if (definition.assignee.forgetWhenExpired) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...forgetWhenExpiredBaseRules));
  }

  /**
   * expire
   */

  const expireBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_expiration_changed_by_or_at',
        changedPathsOnlyAt('_activity', ['expiration_changed_by', 'expiration_changed_at']),
      ),
      q.Or(
        pathChangedWith('_activity.expiration_changed_by', q.Var('passportUser')),
        pathChangedWith('_activity.expiration_changed_at', q.Now()),
      ),
    ),
    BiotaRule('path_changed_only_at__validity_expires_at', changedPathsOnlyAt('_validity', ['expires_at'])),
  ];

  if (definition.self.expire) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...expireBaseRules));
  }

  if (definition.owner.expire) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...expireBaseRules));
  }

  if (definition.assignee.expire) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...expireBaseRules));
  }

  /**
   * restore
   */

  const restoreBaseRules = [
    pathHasntChanged('_auth'),
    pathHasntChanged('_membership'),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_expiration_restored_by_or_at',
        changedPathsOnlyAt('_activity', ['restored_by', 'restored_at']),
      ),
      q.Or(pathChangedWith('_activity.restored_by', q.Var('passportUser')), pathChangedWith('_activity.restored_at', q.Now())),
    ),
    BiotaRule('path_changed_only_at__validity_deleted_or_expires_at', changedPathsOnlyAt('_validity', ['deleted', 'expires_at'])),
  ];

  if (definition.self.restore) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...restoreBaseRules));
  }

  if (definition.owner.restore) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...restoreBaseRules));
  }

  if (definition.assignee.restore) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...restoreBaseRules));
  }

  /**
   * remember
   */

  const rememberBaseRules = [
    pathHasntChanged('_auth'),
    pathHasntChanged('_membership'),
    pathHasntChanged('_validity'),
    q.And(
      BiotaRule('path_changed_only_at__activity_remembered_by_or_at', changedPathsOnlyAt('_activity', ['remembered_by', 'remembered_at'])),
      q.Or(pathChangedWith('_activity.remembered_by', q.Var('passportUser')), pathChangedWith('_activity.remembered_at', q.Now())),
    ),
  ];

  if (definition.self.restore) {
    actions.history_write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...rememberBaseRules));
  }

  if (definition.owner.restore) {
    actions.history_write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...rememberBaseRules));
  }

  if (definition.assignee.restore) {
    actions.history_write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...rememberBaseRules));
  }

  /**
   * set/remove Owner
   */

  const setRemoveOwnerBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_owner_changed_by_or_at',
        changedPathsOnlyAt('_activity', ['owner_changed_by', 'owner_changed_at']),
      ),
      q.Or(pathChangedWith('_activity.owner_changed_by', q.Var('passportUser')), pathChangedWith('_activity.owner_changed_at', q.Now())),
    ),
  ];

  const setOwnerBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__membership_owner', changedPathsOnlyAt('_membership', ['owner'])),
      BiotaRule('is_ref_at__membership.owner', q.IsRef(q.Select(helpers.path('_membership.owner'), q.Var('newDoc'), null))),
    ),
  ];

  if (definition.self.setOwner) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveOwnerBaseRules, ...setOwnerBaseRules));
  }

  if (definition.owner.setOwner) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...setOwnerBaseRules));
  }

  if (definition.assignee.setOwner) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...setOwnerBaseRules));
  }

  const removeOwnerBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__membership_owner', changedPathsOnlyAt('_membership', ['owner'])),
      BiotaRule('is_null_at__membership.owner', q.IsNull(q.Select(helpers.path('_membership.owner'), q.Var('newDoc'), 'this is not null'))),
    ),
  ];

  if (definition.self.removeOwner) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveOwnerBaseRules, ...removeOwnerBaseRules),
    );
  }

  if (definition.owner.removeOwner) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...removeOwnerBaseRules));
  }

  if (definition.assignee.removeOwner) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveOwnerBaseRules, ...removeOwnerBaseRules));
  }

  /**
   * set/remove Assignee
   */

  const setRemoveAssigneeBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_assignees_changed_by_or_at',
        changedPathsOnlyAt('_activity', ['assignees_changed_by', 'assignees_changed_at']),
      ),
      q.Or(
        pathChangedWith('_activity.assignees_changed_by', q.Var('passportUser')),
        pathChangedWith('_activity.assignees_changed_at', q.Now()),
      ),
    ),
  ];

  const setAssigneeBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__membership_assignees', changedPathsOnlyAt('_membership', ['assignees'])),
      BiotaRule(
        'no_elements_removed_at__membership.assignees',
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
    ),
  ];

  if (definition.self.setAssignee) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAssigneeBaseRules, ...setAssigneeBaseRules),
    );
  }

  if (definition.owner.setAssignee) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...setAssigneeBaseRules));
  }

  if (definition.assignee.setAssignee) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...setAssigneeBaseRules));
  }

  const removeAssigneeBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__membership_assignees', changedPathsOnlyAt('_membership', ['assignees'])),
      BiotaRule(
        'no_elements_added_at__membership.assignees',
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
    ),
  ];

  if (definition.self.removeAssignee) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAssigneeBaseRules, ...removeAssigneeBaseRules),
    );
  }

  if (definition.owner.removeAssignee) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...removeAssigneeBaseRules));
  }

  if (definition.assignee.removeAssignee) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules, ...removeAssigneeBaseRules));
  }

  /**
   * set/remove Role
   */

  const setRemoveRoleBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_auth'),
    pathHasntChanged('_validity'),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_roles_changed_by_or_at',
        changedPathsOnlyAt('_activity', ['roles_changed_by', 'roles_changed_at']),
      ),
      q.Or(pathChangedWith('_activity.roles_changed_by', q.Var('passportUser')), pathChangedWith('_activity.roles_changed_at', q.Now())),
    ),
  ];

  const setRoleBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__membership_roles', changedPathsOnlyAt('_membership', ['roles'])),
      BiotaRule(
        'no_elements_removed_at__membership.roles',
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
    ),
  ];

  if (definition.self.setRole) {
    actions.write.or.push(q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveRoleBaseRules, ...setRoleBaseRules));
  }

  if (definition.owner.setRole) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...setRoleBaseRules));
  }

  if (definition.assignee.setRole) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...setRoleBaseRules));
  }

  const removeRoleBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__membership_roles', changedPathsOnlyAt('_membership', ['roles'])),
      BiotaRule(
        'no_elements_added_at__membership.roles',
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
    ),
  ];

  if (definition.self.removeRole) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveRoleBaseRules, ...removeRoleBaseRules),
    );
  }

  if (definition.owner.removeRole) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...removeRoleBaseRules));
  }

  if (definition.assignee.removeRole) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveRoleBaseRules, ...removeRoleBaseRules));
  }

  /**
   * set/remove Auth Email
   */

  const setRemoveAuthEmailBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_membership'),
    pathHasntChanged('_validity'),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_email_changed_by_or_at',
        changedPathsOnlyAt('_activity', ['auth_email_changed_by', 'auth_email_changed_at']),
      ),
      q.Or(
        pathChangedWith('_activity.auth_email_changed_by', q.Var('passportUser')),
        pathChangedWith('_activity.auth_email_changed_at', q.Now()),
      ),
    ),
  ];

  const setAuthEmailBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__auth_email', changedPathsOnlyAt('_auth', ['email'])),
      BiotaRule('is_ref_at__auth.email', q.IsRef(q.Select(helpers.path('_auth.email'), q.Var('newDoc'), null))),
    ),
  ];

  if (definition.self.setAuthEmail) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthEmailBaseRules, ...setAuthEmailBaseRules),
    );
  }

  if (definition.owner.setAuthEmail) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...setAuthEmailBaseRules));
  }

  if (definition.assignee.setAuthEmail) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...setAuthEmailBaseRules));
  }

  const removeAuthEmailBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__auth_email', changedPathsOnlyAt('_auth', ['email'])),
      BiotaRule('is_null_at__auth.email', q.IsNull(q.Select(helpers.path('_auth.email'), q.Var('newDoc'), 'this is not null'))),
    ),
  ];

  if (definition.self.removeAuthEmail) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthEmailBaseRules, ...removeAuthEmailBaseRules),
    );
  }

  if (definition.owner.removeAuthEmail) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...removeAuthEmailBaseRules));
  }

  if (definition.assignee.removeAuthEmail) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveAuthEmailBaseRules, ...removeAuthEmailBaseRules));
  }

  /**
   * set/remove Auth Account
   */

  const setRemoveAuthAccountBaseRules = [
    documentIsAvailable(q.Get('oldDoc')),
    pathHasntChanged('_membership'),
    pathHasntChanged('_validity'),
    q.And(
      BiotaRule(
        'path_changed_only_at__activity_auth_accounts_changed_by_or_at',
        changedPathsOnlyAt('_activity', ['auth_accounts_changed_by', 'auth_accounts_changed_at']),
      ),
      q.Or(
        pathChangedWith('_activity.auth_accounts_changed_by', q.Var('passportUser')),
        pathChangedWith('_activity.auth_accounts_changed_at', q.Now()),
      ),
    ),
  ];

  const setAuthAccountBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__auth_accounts', changedPathsOnlyAt('_auth', ['accounts'])),
      BiotaRule(
        'no_elements_removed_at__membership.roles',
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
    ),
  ];

  if (definition.self.setAuthEmail) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthAccountBaseRules, ...setAuthAccountBaseRules),
    );
  }

  if (definition.owner.setAuthEmail) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...setAuthAccountBaseRules));
  }

  if (definition.assignee.setAuthEmail) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...setAuthAccountBaseRules));
  }

  const removeAuthAccountBaseRules = [
    q.And(
      BiotaRule('path_changed_only_at__auth_accounts', changedPathsOnlyAt('_auth', ['accounts'])),
      BiotaRule(
        'no_elements_added_at__membership.roles',
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
    ),
  ];

  if (definition.self.removeAuthEmail) {
    actions.write.or.push(
      q.And(referenceIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAuthAccountBaseRules, ...removeAuthAccountBaseRules),
    );
  }

  if (definition.owner.removeAuthEmail) {
    actions.write.or.push(q.And(documentOfOwner(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...removeAuthAccountBaseRules));
  }

  if (definition.assignee.removeAuthEmail) {
    actions.write.or.push(q.And(documentOfAssignee(q.Var('oldDoc')), ...setRemoveAuthAccountBaseRules, ...removeAuthAccountBaseRules));
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
