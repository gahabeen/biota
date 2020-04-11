import { DBFactoryFQLBaseDelete } from '~/../types/factory/factory.fql.base';
import { get } from '~/factory/api/fql/base/get';

export const delete_: DBFactoryFQLBaseDelete = {
  document(collection, id) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.document(collection, id);
  },
  database(name) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.database(name);
  },
  collection(name) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.collection(name);
  },
  index(name) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.index(name);
  },
  udfunction(name) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.udfunction(name);
  },
  role(name) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.role(name);
  },
  token(id) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.token(id);
  },
  key(id) {
    //  #comment
    // Nothing necessary, logging do the job
    return get.key(id);
  },
};
