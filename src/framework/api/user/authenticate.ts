import { DBFrameworkAuthAuthenticateResponse } from "~/../types/framework/framework.auth";
import * as qs from "querystring";
import axios from "axios";

export async function authenticate(url: string, data: object): Promise<DBFrameworkAuthAuthenticateResponse> {
  return axios.post(url, data).then(({ data }) => {
    if (typeof data === "string") {
      return qs.parse(data);
    } else {
      return data;
    }
  }) as Promise<DBFrameworkAuthAuthenticateResponse>;
}
