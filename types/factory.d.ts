import { BiotaFactoryFQLBase } from "./factory/factory.fql.base";
import { BiotaFactoryFQLUDF } from "./factory/factory.fql.udf";
import { BiotaFactoryCall } from "./factory/factory.udf";

export interface BiotaFactoryFQL {
  base: BiotaFactoryFQLBase;
  udf: BiotaFactoryFQLUDF;
}

export interface BiotaFactory {
  fql: BiotaFactoryFQL;
  udf: BiotaFactoryCall;
}
