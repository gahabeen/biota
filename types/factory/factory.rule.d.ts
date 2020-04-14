export type FactoryRuleAuthor = 'self' | 'owner' | 'assignee';

export interface FactoryRuleDefinitionPathsOptions {
  immutablePaths?: string[];
}

export interface FactoryRuleDefinitionPaths {
  self?: FactoryRuleDefinitionPathsOptions;
  owner?: FactoryRuleDefinitionPathsOptions;
  assignee?: FactoryRuleDefinitionPathsOptions;
}

export interface FactoryRuleBooleanDefinition {
  immutablePaths?: string[];
  get?: boolean;
  getHistory?: boolean;
  insert?: boolean;
  insertHistory?: boolean;
  update?: boolean;
  replace?: boolean;
  delete?: boolean;
  forget?: boolean;
  expire?: boolean;
  restore?: boolean;
  setOwner?: boolean;
  removeOwner?: boolean;
  setAssignee?: boolean;
  removeAssignee?: boolean;
  setRole?: boolean;
  removeRole?: boolean;
}

export interface FactoryRuleDefinition {
  immutablePaths?: string[];
  get?: FactoryRuleAuthor[];
  getHistory?: FactoryRuleAuthor[];
  insert?: FactoryRuleAuthor[];
  insertHistory?: FactoryRuleAuthor[];
  update?: FactoryRuleAuthor[];
  replace?: FactoryRuleAuthor[];
  delete?: FactoryRuleAuthor[];
  forget?: FactoryRuleAuthor[];
  expire?: FactoryRuleAuthor[];
  restore?: FactoryRuleAuthor[];
  setOwner?: FactoryRuleAuthor[];
  removeOwner?: FactoryRuleAuthor[];
  setAssignee?: FactoryRuleAuthor[];
  removeAssignee?: FactoryRuleAuthor[];
  setRole?: FactoryRuleAuthor[];
  removeRole?: FactoryRuleAuthor[];
}
