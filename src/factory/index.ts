import * as ql from './api/ql';
import * as foundation from './api/foundation';
import * as constructors from './api/constructors';

import * as proxy from './api/proxy';

import { util } from './api/util';
import { validator } from './api/validator';

import { action } from './api/action';
import { collection } from './api/collection';
import { collections } from './api/collections';
import { credential } from './api/credential';
import { credentials } from './api/credentials';
import { database } from './api/database';
import { databases } from './api/databases';
import { document } from './api/document';
import { documents } from './api/documents';
import { index } from './api/index';
import { indexes } from './api/indexes';
import { key } from './api/key';
import { keys } from './api/keys';
import { role } from './api/role';
import { roles } from './api/roles';
import { token } from './api/token';
import { tokens } from './api/tokens';
import { udfunction } from './api/udfunction';
import { udfunctions } from './api/udfunctions';
import { user } from './api/user';
import { users } from './api/users';
import { session } from './api/session';
import { sessions } from './api/sessions';

export const factoryApi = {
  util,
  validator,
  action,
  collection,
  collections,
  credential,
  credentials,
  database,
  databases,
  document,
  documents,
  index,
  indexes,
  key,
  keys,
  role,
  roles,
  token,
  tokens,
  udfunction,
  udfunctions,
  user,
  users,
  session,
  sessions,
  proxy,
};

export const factory = {
  ql,
  foundation,
  constructors,
  ...factoryApi,
};
