// types
import { Fauna } from "~/../types/db";
// external
import { DB } from "~/db";

export async function login(id: Fauna.Expr, password: string): Promise<DB> {
  try {
    const loggedin = await this.collection("users")
      .login(password, id)
      .query();
    return new DB({ secret: loggedin.secret });
  } catch (e) {
    console.error(e);
  }
}
