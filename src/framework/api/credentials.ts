import { FrameworkCredentialsApi } from '~/types/framework/framework.credentials';

import { findAll } from '~/framework/api/credentials/findAll';
import { findByInstance } from '~/framework/api/credentials/findByInstance';

export const credentials: FrameworkCredentialsApi = {
  findAll,
  findByInstance,
};
