// types
import { Fauna } from "~/../types/db";
// external
import { DB } from "~/db";
import * as collectionFactory from "~/factory/api/collection";

export async function login(id: string, password: string): Promise<DB> {
  try {
    const loggedin = await this.query(
      collectionFactory.collection("users").login(id, password)
    );
    return new DB({ secret: loggedin.secret });
  } catch (e) {
    console.error(e);
  }
}
