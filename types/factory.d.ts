import { DBFactoryFQLBase } from "./factory.fql.base";
import { DBFactoryFQLUDF } from "./factory/factory.fql.udf";
import { DBFactoryUDF } from "./factory.udf";

export interface DBFactoryFQL {
  base: DBFactoryFQLBase;
  udf: DBFactoryFQLUDF;
}

export interface DBFactory {
  fql: DBFactoryFQL;
  udf: DBFactoryUDF;
}
