import { Fauna } from '~/types/db';
import { Biota } from '~/biota';
// const debug = Debug('biota').extend('query');

export async function query(this: Biota, fqlQuery: Fauna.Expr) {
  return this.client.query(fqlQuery).catch((err) => {
    const { requestResult } = err || {};
    const { requestRaw, responseRaw } = requestResult || {};
    let request = {};
    let response = {};

    try {
      request = JSON.parse(requestRaw);
      // tslint:disable-next-line: no-empty
    } catch (error) {}
    try {
      response = JSON.parse(responseRaw);
      // tslint:disable-next-line: no-empty
    } catch (error) {}

    let { errors } = response || ({} as any);

    if (errors && !Array.isArray(errors)) errors = [errors];
    let errorsArray = [];

    if (Array.isArray(errors)) {
      errorsArray = errors.map((error) => {
        let newError: any = {};
        let context = {};
        let params = {};

        let location = request;
        // tslint:disable-next-line: forin
        for (const key of error.position) {
          location = location[`${key}`];
        }

        if (error.code === 'transaction aborted') {
          const errorArray = error.description.split('%||%').map((i) => (i && i.includes('%%%') ? i.split('%%%') : i));
          const trace = (errorArray[1] || []).map((i) => {
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
          try {
            context = JSON.parse(errorArray[4]);
            // tslint:disable-next-line: no-empty
          } catch (error) {}
          try {
            params = JSON.parse(errorArray[3]);
            // tslint:disable-next-line: no-empty
          } catch (error) {}
          newError = {
            message: errorArray[2],
            name: errorArray[0],
            trace,
            params,
            code: error.code,
            context,
          };

          // debug(JSON.stringify(newError, null, 2));
          // debug(JSON.stringify(newError, null, 2));
        } else {
          newError = error;
        }

        newError.position = error.position;
        newError.location = location;

        return newError;
      });
    }

    const errorResponse = {
      errors: errorsArray,
      response,
      request,
      // err
    };

    // debug(JSON.stringify(errorResponse, null, 2));
    return errorResponse;
  });
}
