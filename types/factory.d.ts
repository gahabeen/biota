import { DBFactoryFQLBase } from "./factory/factory.fql.base";
import { DBFactoryFQLUDF } from "./factory/factory.fql.udf";
import { DBFactoryCall } from "./factory/factory.udf";

export interface DBFactoryFQL {
  base: DBFactoryFQLBase;
  udf: DBFactoryFQLUDF;
}

export interface DBFactory {
  fql: DBFactoryFQL;
  udf: DBFactoryCall;
}
