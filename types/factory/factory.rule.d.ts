export type FactoryRuleAuthor = 'self' | 'owner' | 'assignee' | 'admin';

export interface FactoryRuleDefinitionPathsOptions {
  immutablePaths?: string[];
}

export interface FactoryRuleDefinitionPaths {
  admin?: FactoryRuleDefinitionPathsOptions;
  self?: FactoryRuleDefinitionPathsOptions;
  owner?: FactoryRuleDefinitionPathsOptions;
  assignee?: FactoryRuleDefinitionPathsOptions;
}
export interface FactoryRuleDefinition {
  immutablePaths?: string[];
  get?: FactoryRuleAuthor[] | boolean;
  getHistory?: FactoryRuleAuthor[] | boolean;
  getHistoryWhenDeleted?: FactoryRuleAuthor[] | boolean;
  getHistoryWhenExpired?: FactoryRuleAuthor[] | boolean;
  insert?: FactoryRuleAuthor[] | boolean;
  insertHistory?: FactoryRuleAuthor[] | boolean;
  update?: FactoryRuleAuthor[] | boolean;
  replace?: FactoryRuleAuthor[] | boolean;
  delete?: FactoryRuleAuthor[] | boolean;
  getWhenDeleted?: FactoryRuleAuthor[] | boolean;
  updateWhenDeleted?: FactoryRuleAuthor[] | boolean;
  replaceWhenDeleted?: FactoryRuleAuthor[] | boolean;
  forgetWhenDeleted?: FactoryRuleAuthor[] | boolean;
  expire?: FactoryRuleAuthor[] | boolean;
  getWhenExpired?: FactoryRuleAuthor[] | boolean;
  updateWhenExpired?: FactoryRuleAuthor[] | boolean;
  replaceWhenExpired?: FactoryRuleAuthor[] | boolean;
  forgetWhenExpired?: FactoryRuleAuthor[] | boolean;
  forget?: FactoryRuleAuthor[] | boolean;
  restore?: FactoryRuleAuthor[] | boolean;
  remember?: FactoryRuleAuthor[] | boolean;
  setOwner?: FactoryRuleAuthor[] | boolean;
  removeOwner?: FactoryRuleAuthor[] | boolean;
  setAssignee?: FactoryRuleAuthor[] | boolean;
  removeAssignee?: FactoryRuleAuthor[] | boolean;
  setRole?: FactoryRuleAuthor[] | boolean;
  removeRole?: FactoryRuleAuthor[] | boolean;
}