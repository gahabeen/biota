import { query as q } from "faunadb";
import { UDFunction, udfunctionNameNormalized } from "~/factory/classes/udfunction";
import { roleNameNormalized } from "~/factory/classes/role";
import { collectionNameNormalized } from "~/factory/classes/collection";

export const AuthStartUserSession = UDFunction({
  name: udfunctionNameNormalized("AuthStartUserSession"),
  body: q.Query((identity, user, password, delayInMs) =>
    q.Let(
      {
        valid: q.If(q.IsRef(q.Var("user")), q.Identify(q.Var("user"), q.Var("password")), false),
        expire_at: q.If(
          q.IsNull(q.Var("delayInMs")),
          q.TimeAdd(q.Now(), 1, "hours"),
          q.TimeAdd(q.Now(), q.ToNumber(q.Var("delayInMs")), "milliseconds")
        ),
      },
      q.If(
        q.Var("valid"),
        q.Let(
          {
            session: q.Create(q.Collection(collectionNameNormalized("user_sessions")), {
              data: {
                _membership: {
                  owner: q.Var("identity"),
                },
                _activity: {
                  created_at: q.Now(),
                  created_by: q.Var("identity"),
                  expire_at: q.Var("expire_at"),
                },
              },
            }),
            token: q.Create(q.Tokens(), { instance: q.Select("ref", q.Var("session"), null) }),
          },
          q.Select("secret", q.Var("token"), false)
        ),
        false
      )
    )
  ),
  role: q.Role(roleNameNormalized("system")),
});
