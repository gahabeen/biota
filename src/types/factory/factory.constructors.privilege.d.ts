import { FaunaRolePrivilegeActions } from '../fauna';
import { FactoryRuleDefinition } from './factory.rule';
import { Expr } from 'faunadb';

export interface BiotaActionsDefinition {
  global?: FaunaRolePrivilegeActions;
  public?: FactoryRuleDefinition<boolean>;
  self?: FactoryRuleDefinition<boolean>;
  owner?: FactoryRuleDefinition<boolean>;
  assignee?: FactoryRuleDefinition<boolean>;
  admin?: FactoryRuleDefinition<boolean>;
}

export interface ActionRuleDefinition {
  or?: Expr[];
  and?: Expr[];
}
