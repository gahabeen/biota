import Debug from 'debug';
import { Fauna } from '~/../types/db';
import { Biota } from '~/biota';
const debug = Debug('biota').extend('query');

export async function query(this: Biota, fqlQuery: Fauna.Expr) {
  return this.client.query(fqlQuery).catch((err) => {
    const { message, requestResult } = err || {};
    const { requestRaw, responseRaw } = requestResult || {};
    let request = {};
    let hasRequest = false;
    let response = {};
    let hasResponse = false;

    try {
      request = JSON.parse(requestRaw);
      hasRequest = true;
      // tslint:disable-next-line: no-empty
    } catch (error) {}
    try {
      response = JSON.parse(responseRaw);
      hasResponse = true;
      // tslint:disable-next-line: no-empty
    } catch (error) {}

    const { errors } = response || ({} as any);

    const errorResponse = {
      errors: errors.map((error) => {
        if (error.code === 'transaction aborted') {
          const errorArray = error.description.split('%||%').map((i) => (i && i.includes('%%%') ? i.split('%%%') : i));
          const trace = errorArray[1].map((i) => {
            if (i.includes('%|%')) {
              const splitted = i.split('%|%');
              try {
                splitted[1] = JSON.parse(splitted[1]);
                // tslint:disable-next-line: no-empty
              } catch (error) {}
              return splitted;
            }
            return i;
          });
          let context = {};
          let params = {};
          try {
            context = JSON.parse(errorArray[4]);
            // tslint:disable-next-line: no-empty
          } catch (error) {}
          try {
            params = JSON.parse(errorArray[3]);
            // tslint:disable-next-line: no-empty
          } catch (error) {}
          let location = request;
          // tslint:disable-next-line: forin
          for (const key of error.position) {
            location = location[`${key}`];
          }
          return {
            message: errorArray[2],
            name: errorArray[0],
            trace,
            params,
            position: error.position,
            location,
            code: error.code,
            context,
          };
        }
        return error;
      }),
    };

    debug(JSON.stringify(errorResponse, null, 2));
    return errorResponse;
  });
}
