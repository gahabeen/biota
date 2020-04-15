import { Expr, query as q } from 'faunadb';
import { FaunaRef, FaunaRolePrivilegeActions } from 'types/fauna';
import { FactoryRuleDefinition, FactoryRuleDefinitionPaths } from '~/../types/factory/factory.rule';
import { Identity } from '~/factory/api/ql';
import * as helpers from '~/helpers';
import { TS_2500_YEARS } from '~/consts';

interface RuleParserOptions {
  global?: FaunaRolePrivilegeActions;
  self?: FactoryRuleDefinition;
  owner?: FactoryRuleDefinition;
  assignee?: FactoryRuleDefinition;
  admin?: FactoryRuleDefinition;
}

interface ActionRuleDefinition {
  or?: Expr[];
  and?: Expr[];
}

function prepareRules(rules: FactoryRuleDefinition = {}, paths?: FactoryRuleDefinitionPaths): RuleParserOptions {
  // tslint:disable-next-line: prefer-const
  let defaultRuleDefinition: FactoryRuleDefinition = {
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
    setOwner: false,
    removeOwner: false,
    setAssignee: false,
    removeAssignee: false,
    setRole: false,
    removeRole: false,
  };
  const actions: RuleParserOptions = {
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
  if ((paths.self.immutablePaths || []).length > 0) {
    actions.self.immutablePaths = paths.self.immutablePaths;
  }
  if ((paths.owner.immutablePaths || []).length > 0) {
    actions.owner.immutablePaths = paths.owner.immutablePaths;
  }
  if ((paths.assignee.immutablePaths || []).length > 0) {
    actions.assignee.immutablePaths = paths.assignee.immutablePaths;
  }
  return actions;
}

export function ruleParser(rules: FactoryRuleDefinition = {}, immutablePaths?: FactoryRuleDefinitionPaths): FaunaRolePrivilegeActions {
  const options: RuleParserOptions = prepareRules(rules, immutablePaths);
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
      return q.And(...andRules);
    }
  }
  const RefIsSelf = (ref: FaunaRef) => q.If(q.IsRef(ref), q.Equals(ref, Identity()), false);
  const DocOfOwner = (doc: Expr) => q.Equals(q.Select(helpers.path('_membership.owner'), doc), Identity());
  const DocOfAssignee = (doc: Expr) => {
    return q.Let(
      {
        raw_assignees: q.Select(helpers.path('_membership.assignees'), doc, []),
        assignees: q.If(q.IsArray(q.Var('raw_assignees')), q.Var('raw_assignees'), []),
      },
      q.Not(q.IsEmpty(q.Filter(q.Var('assignees'), q.Lambda('assignee', q.Equals(q.Var('assignee'), Identity()))))),
    );
  };
  const changedPathsOnlyAt = (root: string, allowedChangedSubPaths: string[]) => {
    return q.Let(
      {
        foundChangedPaths: q.Reduce(
          q.Lambda(
            ['list', 'value'],
            q.Let(
              {
                newObjRoot: q.Select(helpers.path(root), q.Var('newObj'), {}),
                oldObjRoot: q.Select(helpers.path(root), q.Var('newObj'), {}),
                key1: q.Select(0, q.Var('value'), null),
                value1: q.Select(1, q.Var('value'), null),
                hasKey2: q.Contains([q.Var('key1')], q.Var('newObjRoot')),
                value2: q.Select(q.Var('key1'), q.Var('newObjRoot'), null),
              },
              q.If(
                q.And(q.Var('hasKey2'), q.Equals(q.Var('value1'), q.Var('value2'))),
                q.Var('list'),
                q.Append([q.Var('key1')], q.Var('list')),
              ),
            ),
          ),
          [],
          q.ToArray(q.Var('oldObjRoot')),
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
  const PathHasntChanged = (path: string) => {
    return q.Equals(q.Select(helpers.path(path), q.Var('oldDoc'), {}), q.Select(helpers.path(path), q.Var('newDoc'), {}));
  };
  const PathChangedWith = (path: string, value: any) => {
    return q.Equals(q.Select(helpers.path(path), q.Var('oldDoc'), {}), value);
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

  if (Array.isArray(options.self.immutablePaths)) {
    addImmutablePaths(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), options.self.immutablePaths);
  }

  if (Array.isArray(options.owner.immutablePaths)) {
    addImmutablePaths(DocOfOwner(q.Var('oldDoc')), options.owner.immutablePaths);
  }

  if (Array.isArray(options.assignee.immutablePaths)) {
    addImmutablePaths(DocOfAssignee(q.Var('oldDoc')), options.self.immutablePaths);
  }

  /**
   * get
   */
  const getBaseRules = [documentIsAvailable(q.Get(q.Var('ref')))];

  if (options.self.get) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getBaseRules));
  }

  if (options.owner.get) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getBaseRules));
  }

  if (options.assignee.get) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getBaseRules));
  }

  /**
   * getWhenDeleted
   */
  const getWhenDeletedBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (options.self.getWhenDeleted) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getWhenDeletedBaseRules));
  }

  if (options.owner.getWhenDeleted) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getWhenDeletedBaseRules));
  }

  if (options.assignee.getWhenDeleted) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getWhenDeletedBaseRules));
  }

  /**
   * getWhenExpired
   */
  const getWhenExpiredBaseRules = [documentIsExpired(q.Get(q.Var('ref')))];

  if (options.self.getWhenExpired) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getWhenExpiredBaseRules));
  }

  if (options.owner.getWhenExpired) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getWhenExpiredBaseRules));
  }

  if (options.assignee.getWhenExpired) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getWhenExpiredBaseRules));
  }

  /**
   * getHistory
   */
  const getHistoryBaseRules = [documentIsAvailable(q.Get(q.Var('ref')))];

  if (options.self.getHistory) {
    actions.history_read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getHistoryBaseRules));
  }

  if (options.owner.getHistory) {
    actions.history_read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getHistoryBaseRules));
  }

  if (options.assignee.getHistory) {
    actions.history_read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getHistoryBaseRules));
  }

  /**
   * getHistoryWhenDeleted
   */
  const getHistoryWhenDeletedBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (options.self.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getHistoryWhenDeletedBaseRules));
  }

  if (options.owner.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getHistoryWhenDeletedBaseRules));
  }

  if (options.assignee.getHistoryWhenDeleted) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getHistoryWhenDeletedBaseRules));
  }

  /**
   * getHistoryWhenExpired
   */
  const getHistoryWhenExpiredBaseRules = [documentIsDeleted(q.Get(q.Var('ref')))];

  if (options.self.getHistoryWhenExpired) {
    actions.read.or.push(q.And(RefIsSelf(q.Var('ref')), ...getHistoryWhenExpiredBaseRules));
  }

  if (options.owner.getHistoryWhenExpired) {
    actions.read.or.push(q.And(DocOfOwner(q.Get(q.Var('ref'))), ...getHistoryWhenExpiredBaseRules));
  }

  if (options.assignee.getHistoryWhenExpired) {
    actions.read.or.push(q.And(DocOfAssignee(q.Get(q.Var('ref'))), ...getHistoryWhenExpiredBaseRules));
  }

  /**
   * insert
   */
  const insertBaseRules = [
    PathHasntChanged('_activity'),
    PathHasntChanged('_auth'),
    q.And(
      changedPathsOnlyAt('_activity', ['inserted_by', 'inserted_at']),
      q.Or(PathChangedWith('_activity.inserted_by', Identity()), PathChangedWith('_activity.inserted_at', q.Now())),
    ),
    q.And(changedPathsOnlyAt('_membership', ['owner']), PathChangedWith('_membership.owner', Identity())),
  ];

  if (options.self.insert) {
    actions.create.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('doc'))), ...insertBaseRules));
  }

  if (options.owner.insert) {
    actions.create.or.push(q.And(DocOfOwner(q.Var('doc')), ...insertBaseRules));
  }

  if (options.assignee.insert) {
    actions.create.or.push(q.And(DocOfAssignee(q.Var('doc')), ...insertBaseRules));
  }

  /**
   * insertHistory
   */

  // if (options.self.insertHistory) {
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
      q.Or(PathChangedWith('_activity.updated_by', Identity()), PathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (options.self.update) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateBaseRules));
  }

  if (options.owner.update) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...updateBaseRules));
  }

  if (options.assignee.update) {
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
      q.Or(PathChangedWith('_activity.updated_by', Identity()), PathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (options.self.updateWhenDeleted) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateWhenDeletedBaseRules));
  }

  if (options.owner.updateWhenDeleted) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...updateWhenDeletedBaseRules));
  }

  if (options.assignee.updateWhenDeleted) {
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
      q.Or(PathChangedWith('_activity.updated_by', Identity()), PathChangedWith('_activity.updated_at', q.Now())),
    ),
  ];

  if (options.self.updateWhenExpired) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...updateWhenExpiredBaseRules));
  }

  if (options.owner.updateWhenExpired) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...updateWhenExpiredBaseRules));
  }

  if (options.assignee.updateWhenExpired) {
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
      q.Or(PathChangedWith('_activity.replaced_by', Identity()), PathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (options.self.replace) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceBaseRules));
  }

  if (options.owner.replace) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...replaceBaseRules));
  }

  if (options.assignee.replace) {
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
      q.Or(PathChangedWith('_activity.replaced_by', Identity()), PathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (options.self.replaceWhenDeleted) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceWhenDeletedBaseRules));
  }

  if (options.owner.replaceWhenDeleted) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...replaceWhenDeletedBaseRules));
  }

  if (options.assignee.replaceWhenDeleted) {
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
      q.Or(PathChangedWith('_activity.replaced_by', Identity()), PathChangedWith('_activity.replaced_at', q.Now())),
    ),
  ];

  if (options.self.replaceWhenExpired) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...replaceWhenExpiredBaseRules));
  }

  if (options.owner.replaceWhenExpired) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...replaceWhenExpiredBaseRules));
  }

  if (options.assignee.replaceWhenExpired) {
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
      q.Or(PathChangedWith('_activity.deleted_by', Identity()), PathChangedWith('_activity.deleted_at', q.Now())),
    ),
    q.And(
      changedPathsOnlyAt('_validity', ['deleted']),
      q.Or(PathChangedWith('_validity.deleted', true), PathChangedWith('_validity.deleted', false)),
    ),
  ];

  if (options.self.delete) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...deleteBaseRules));
  }

  if (options.owner.delete) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...deleteBaseRules));
  }

  if (options.assignee.delete) {
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
      q.Or(PathChangedWith('_activity.forgotten_by', Identity()), PathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (options.self.forget) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetBaseRules));
  }

  if (options.owner.forget) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...forgetBaseRules));
  }

  if (options.assignee.forget) {
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
      q.Or(PathChangedWith('_activity.forgotten_by', Identity()), PathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (options.self.forgetWhenDeleted) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetWhenDeletedBaseRules));
  }

  if (options.owner.forgetWhenDeleted) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...forgetWhenDeletedBaseRules));
  }

  if (options.assignee.forgetWhenDeleted) {
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
      q.Or(PathChangedWith('_activity.forgotten_by', Identity()), PathChangedWith('_activity.forgotten_at', q.Now())),
    ),
  ];

  if (options.self.forgetWhenExpired) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...forgetWhenExpiredBaseRules));
  }

  if (options.owner.forgetWhenExpired) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...forgetWhenExpiredBaseRules));
  }

  if (options.assignee.forgetWhenExpired) {
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
      q.Or(PathChangedWith('_activity.expiration_changed_by', Identity()), PathChangedWith('_activity.expiration_changed_at', q.Now())),
    ),
    changedPathsOnlyAt('_validity', ['expires_at']),
  ];

  if (options.self.expire) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...expireBaseRules));
  }

  if (options.owner.expire) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...expireBaseRules));
  }

  if (options.assignee.expire) {
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
      q.Or(PathChangedWith('_activity.restored_by', Identity()), PathChangedWith('_activity.restored_at', q.Now())),
    ),
    changedPathsOnlyAt('_validity', ['deleted', 'expires_at']),
  ];

  if (options.self.restore) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...restoreBaseRules));
  }

  if (options.owner.restore) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...restoreBaseRules));
  }

  if (options.assignee.restore) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...restoreBaseRules));
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
      q.Or(PathChangedWith('_activity.owner_changed_by', Identity()), PathChangedWith('_activity.owner_changed_at', q.Now())),
    ),
    changedPathsOnlyAt('_membership', ['owner']),
  ];

  if (options.self.setOwner) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveOwnerBaseRules));
  }

  if (options.owner.setOwner) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveOwnerBaseRules));
  }

  if (options.assignee.setOwner) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveOwnerBaseRules));
  }

  if (options.self.removeOwner) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveOwnerBaseRules));
  }

  if (options.owner.removeOwner) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveOwnerBaseRules));
  }

  if (options.assignee.removeOwner) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveOwnerBaseRules));
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
      q.Or(PathChangedWith('_activity.assignees_changed_by', Identity()), PathChangedWith('_activity.assignees_changed_at', q.Now())),
    ),
    changedPathsOnlyAt('_membership', ['assignees']),
  ];

  if (options.self.setAssignee) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAssigneeBaseRules));
  }

  if (options.owner.setAssignee) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules));
  }

  if (options.assignee.setAssignee) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules));
  }

  if (options.self.removeAssignee) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveAssigneeBaseRules));
  }

  if (options.owner.removeAssignee) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules));
  }

  if (options.assignee.removeAssignee) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveAssigneeBaseRules));
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
      q.Or(PathChangedWith('_activity.roles_changed_by', Identity()), PathChangedWith('_activity.roles_changed_at', q.Now())),
    ),
    changedPathsOnlyAt('_membership', ['roles']),
  ];

  if (options.self.setAssignee) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveRoleBaseRules));
  }

  if (options.owner.setAssignee) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveRoleBaseRules));
  }

  if (options.assignee.setAssignee) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveRoleBaseRules));
  }

  if (options.self.removeAssignee) {
    actions.write.or.push(q.And(RefIsSelf(q.Select('ref', q.Var('oldDoc'), null)), ...setRemoveRoleBaseRules));
  }

  if (options.owner.removeAssignee) {
    actions.write.or.push(q.And(DocOfOwner(q.Var('oldDoc')), ...setRemoveRoleBaseRules));
  }

  if (options.assignee.removeAssignee) {
    actions.write.or.push(q.And(DocOfAssignee(q.Var('oldDoc')), ...setRemoveRoleBaseRules));
  }

  return Object.assign(
    {
      create: buildAction(actions.create),
      delete: buildAction(actions.delete),
      read: buildAction(actions.read),
      write: buildAction(actions.write),
      history_read: buildAction(actions.history_read),
      history_write: buildAction(actions.history_write),
      unrestricted_read: buildAction(actions.unrestricted_read),
      call: buildAction(actions.call),
    },
    options.global,
  );
}
