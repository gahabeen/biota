import * as ql from './api/ql';
import * as foundation from './api/foundation';
import * as constructors from './api/constructors';

import { action } from './api/action';
import { collection } from './api/collection';
import { collections } from './api/collections';
import { credential } from './api/credential';
import { credentials } from './api/credentials';
import { database } from './api/database';
import { databases } from './api/databases';
import { document } from './api/document';
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
import { userSession } from './api/userSession';

export const factory = {
  ql,
  foundation,
  constructors,
  action,
  collection,
  collections,
  credential,
  credentials,
  database,
  databases,
  document,
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
  userSession,
};
