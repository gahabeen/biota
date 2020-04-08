import { query as q } from "faunadb";
import { DBFactorySpecificUserApi } from "~/../types/factory/factory.specific.user";
import * as call from "~/factory/api/call";
import { indexNameNormalized } from "~/factory/classes";
import { udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { CallLogAction, CallSystemOperator } from "~/framework/helpers/call_functions";
import { collectionNameNormalized } from "~/factory/classes/collection";
import { update as updateBaseFQL } from "~/factory/api/fql/base/update";
import { Identity } from "../../ql";

export const user: DBFactorySpecificUserApi = {
  login(email, password) {
    return q.Let(
      {
        doc: q.Select(0, q.Paginate(q.Match(q.Index(indexNameNormalized("users__by__email")), email)), {}),
        action: CallLogAction("login", q.Var("doc")),
      },
      q.If(
        q.IsRef(q.Var("doc")),
        {
          secret: q.Call(udfunctionNameNormalized("AuthStartUserSession"), q.Var("doc"), q.Var("private_key"), q.Var("doc"), password, null),
        },
        { secret: false }
      )
    );
  },
  register(email, password, data = {}) {
    return q.Let(
      {
        doc: q.Call(udfunctionNameNormalized("InsertDocument"), Identity(), collectionNameNormalized("users"), data, null),
        operation: CallSystemOperator(
          updateBaseFQL.document(collectionNameNormalized("user"), q.Select(["ref", "id"], q.Var("doc")), {
            _auth: {
              email: email,
            },
          }),
          q.Select("ref", q.Var("doc"))
        ),
        with_credentials: call.update.credentials(collectionNameNormalized("users"), q.Select(["ref", "id"], q.Var("doc")), { password }),
        action: CallLogAction("register", q.Var("doc")),
      },
      q.Call(udfunctionNameNormalized("UserLogin"), Identity(), email, password)
    );
  },
  changePassword(newPassword) {
    return call.update.credentials(q.Select("collection", q.Identity()) as string, q.Select("id", q.Identity()), { password: newPassword });
  },
};
