import { Biota } from '~/biota';
import { FaunaCollectionOptions, FaunaId } from '~/../types/fauna';
import { udfunction } from '~/factory/api/classes/udfunction';
import { execute } from '~/tasks';
import { IsPrivateKeyValid } from '~/framework/api/defaults/udfunctions';

export function privateKey(this: Biota) {
  const self = this;

  return async function privateKeyMethod(private_key: string) {
    return execute(
      [
        {
          name: `Set private_key [${private_key}]`,
          task() {
            let IsPrivateKeyValidDefinition = IsPrivateKeyValid({ privateKey });
            return self.query(udfunction.upsert.call(self, IsPrivateKeyValidDefinition.name, IsPrivateKeyValidDefinition)).then((res) => {
              self.private_key = private_key;
              return res;
            });
          },
        },
      ],
      {
        domain: 'Biota.privateKey',
      },
    );
  };
}
