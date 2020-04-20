import { FactoryContextDefinition } from './factory.context';

export interface ActionDispatchResult {
  action?: object;
  doc?: object;
}

export interface ResultInferface {
  context?: FactoryContextDefinition;
  data?: any;
  action?: object;
}
