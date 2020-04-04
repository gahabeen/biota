import { query as q } from "faunadb";
import { DBFactoryFQLUDFRepsert } from "~/../types/factory/factory.fql.udf";
import { insert as insertFQLUDF } from "~/factory/api/fql/udf/insert";
import { replace as replaceFQLUDF } from "~/factory/api/fql/udf/replace";

export const repsert: DBFactoryFQLUDFRepsert = {
  document(collection, id, options) {
    return q.If(
      q.Exists(q.Ref(q.Collection(collection), id)),
      replaceFQLUDF.document(collection, id, options),
      insertFQLUDF.document(collection, id, options)
    );
  },
  database(name, options) {
    return q.If(q.Exists(q.Database(name)), replaceFQLUDF.database(name, options), insertFQLUDF.database(name, options));
  },
  collection(name, options) {
    return q.If(q.Exists(q.Collection(name)), replaceFQLUDF.collection(name, options), insertFQLUDF.collection(name, options));
  },
  index(name, options) {
    return q.If(q.Exists(q.Index(name)), replaceFQLUDF.index(name, options), insertFQLUDF.index(name, options));
  },
  udfunction(name, options) {
    return q.If(q.Exists(q.Function(name)), replaceFQLUDF.udfunction(name, options), insertFQLUDF.udfunction(name, options));
  },
  role(name, options) {
    return q.If(q.Exists(q.Role(name)), replaceFQLUDF.role(name, options), insertFQLUDF.role(name, options));
  },
  token(id, options) {
    return q.If(q.Exists(q.Ref(q.Tokens(), name)), replaceFQLUDF.token(name, options), insertFQLUDF.token(name, options));
  },
  key(id, options) {
    return q.If(q.Exists(q.Ref(q.Keys(), id)), replaceFQLUDF.key(id, options), insertFQLUDF.key(id, options));
  },
};
