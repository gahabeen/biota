import { database } from "./client";

type WrapperHandler = (db: any) => Promise<void>;
export function wrapper(handler: WrapperHandler) {
  return async (done: any) => {
    const { db, drop } = await database();
    try {
      // ---
      await handler(db);
      // ---
    } catch (error) {
      done(error);
    } finally {
      await drop();
      done();
    }
  };
}
