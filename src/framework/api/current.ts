import { FrameworkCurrentApi } from '~/types/framework/framework.current';
import { user } from '~/framework/api/current/user';

export const current: FrameworkCurrentApi = {
  user,
  session: {
    _empty: '',
  },
};
