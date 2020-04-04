import { query as q } from "faunadb";
import { DBFactoryFQLUDFUpsert } from "~/../types/factory/factory.fql.udf";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";
import { update as updateFQLUDF } from "~/factory/api/fql/udf/update";

export const upsert: DBFactoryFQLUDFUpsert = {
  document(collection, id, options) {
    return q.If(q.Exists(q.Database(name)), updateFQLUDF.document(collection, id, options), insertFQLUDF.document(collection, options));
  },
  database(name, options = {}) {
    return q.If(q.Exists(q.Database(name)), updateFQLUDF.database(name, options), insertFQLUDF.database(name, options));
  },
  collection(name, options = {}) {
    return q.If(q.Exists(q.Collection(name)), updateFQLUDF.collection(name, options), insertFQLUDF.collection(name, options));
  },
  index(name, options = {}) {
    return q.If(q.Exists(q.Index(name)), updateFQLUDF.index(name, options), insertFQLUDF.index(name, options));
  },
  udfunction(name, options = {}) {
    return q.If(q.Exists(q.Function(name)), updateFQLUDF.udfunction(name, options), insertFQLUDF.udfunction(name, options));
  },
  role(name, options = {}) {
    return q.If(q.Exists(q.Role(name)), updateFQLUDF.role(name, options), insertFQLUDF.role(name, options));
  },
  token(id, options = {}) {
    return q.If(q.Exists(q.Ref(q.Tokens(), id)), updateFQLUDF.token(id, options), insertFQLUDF.token(id, options));
  },
  key(id, options = {}) {
    return q.If(q.Exists(q.Ref(q.Keys(), id)), updateFQLUDF.key(id, options), insertFQLUDF.key(options.name, options));
  },
};
