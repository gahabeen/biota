import * as errors from './errors';
import { Expr } from './Expr';
import * as util from 'util';

const customInspect = util && util.inspect && util.inspect.custom;
const stringify = (util && util.inspect) || JSON.stringify;

const base64 = {
  toByteArray(data: any) {
    return new Buffer(data).toString('base64');
  },
  fromByteArray(byteArr: any) {
    return new Buffer(byteArr, 'base64');
  },
};

export function Value() {}

util.inherits(Value, Expr);

export function Ref(id: string, collection?: undefined, database?: undefined) {
  if (!id) throw new errors.InvalidValue('id cannot be null or undefined');

  this.value = { id };
  if (collection) this.value.collection = collection;
  if (database) this.value.database = database;
}

util.inherits(Ref, Value);

Object.defineProperty(Ref.prototype, 'collection', {
  get() {
    return this.value.collection;
  },
});

Object.defineProperty(Ref.prototype, 'class', {
  get() {
    return this.value.collection;
  },
});

Object.defineProperty(Ref.prototype, 'database', {
  get() {
    return this.value.database;
  },
});

Object.defineProperty(Ref.prototype, 'id', {
  get() {
    return this.value.id;
  },
});

Ref.prototype.toJSON = function () {
  return { '@ref': this.value };
};

wrapToString(Ref, function () {
  const constructors = {
    collections: 'Collection',
    databases: 'Database',
    indexes: 'Index',
    functions: 'Function',
    roles: 'Role',
  };

  const toString = (ref: { collection?: { id: string | number }; database?: { toString: () => string }; id?: string }) => {
    if (ref.collection === undefined) {
      const db = ref.database !== undefined ? ref.database.toString() : '';
      return ref.id.charAt(0).toUpperCase() + ref.id.slice(1) + '(' + db + ')';
    }

    const constructor = constructors[ref.collection.id];
    if (constructor !== undefined) {
      const db = ref.database !== undefined ? ', ' + ref.database.toString() : '';
      return constructor + '("' + ref.id + '"' + db + ')';
    }

    return 'Ref(' + toString(ref.collection as any) + ', "' + ref.id + '")';
  };

  return toString(this);
});

Ref.prototype.valueOf = function () {
  return this.value;
};

Ref.prototype.equals = function (other: any) {
  return (
    other instanceof Ref &&
    this.id === (other as any).id &&
    ((this.collection === undefined && (other as any).collection === undefined) || this.collection.equals((other as any).collection)) &&
    ((this.database === undefined && (other as any).database === undefined) || this.database.equals((other as any).database))
  );
};

export const Native = {
  COLLECTIONS: new Ref('collections'),
  INDEXES: new Ref('indexes'),
  DATABASES: new Ref('databases'),
  FUNCTIONS: new Ref('functions'),
  ROLES: new Ref('roles'),
  KEYS: new Ref('keys'),
  fromName(name: any) {
    switch (name) {
      case 'collections':
        return Native.COLLECTIONS;
      case 'indexes':
        return Native.INDEXES;
      case 'databases':
        return Native.DATABASES;
      case 'functions':
        return Native.FUNCTIONS;
      case 'roles':
        return Native.ROLES;
      case 'keys':
        return Native.KEYS;
    }
    return new Ref(name);
  },
};

export function SetRef(value: any) {
  /** Raw query object. */
  this.value = value;
}

util.inherits(SetRef, Value);

wrapToString(SetRef, function () {
  return Expr.toString(this.value);
});

SetRef.prototype.toJSON = function () {
  return { '@set': this.value };
};

export function FaunaTime(value: string | Date) {
  if (value instanceof Date) {
    value = value.toISOString();
  } else if (!(value.charAt(value.length - 1) === 'Z')) {
    throw new errors.InvalidValue("Only allowed timezone is 'Z', got: " + value);
  }

  this.value = value;
}

util.inherits(FaunaTime, Value);

Object.defineProperty(FaunaTime.prototype, 'date', {
  get() {
    return new Date(this.value);
  },
});

wrapToString(FaunaTime, function () {
  return 'Time("' + this.value + '")';
});

FaunaTime.prototype.toJSON = function () {
  return { '@ts': this.value };
};

export function FaunaDate(value: string | Date) {
  if (value instanceof Date) {
    // The first 10 characters 'YYYY-MM-DD' are the date portion.
    value = value.toISOString().slice(0, 10);
  }

  this.value = value;
}

util.inherits(FaunaDate, Value);

Object.defineProperty(FaunaDate.prototype, 'date', {
  get() {
    return new Date(this.value);
  },
});

wrapToString(FaunaDate, function () {
  return 'Date("' + this.value + '")';
});

FaunaDate.prototype.toJSON = function () {
  return { '@date': this.value };
};

export function Bytes(value: ArrayBuffer | ArrayLike<number> | SharedArrayBuffer) {
  if (value instanceof ArrayBuffer) {
    this.value = new Uint8Array(value);
  } else if (typeof value === 'string') {
    this.value = base64.toByteArray(value);
  } else if (value instanceof Uint8Array) {
    this.value = value;
  } else {
    throw new errors.InvalidValue(
      'Bytes type expect argument to be either Uint8Array|ArrayBuffer|string, got: ' + (stringify as any)(value as any),
    );
  }
}

util.inherits(Bytes, Value);

wrapToString(Bytes, function () {
  return 'Bytes("' + base64.fromByteArray(this.value) + '")';
});

Bytes.prototype.toJSON = function () {
  return { '@bytes': base64.fromByteArray(this.value) };
};

export function Query(value: any) {
  this.value = value;
}

util.inherits(Query, Value);

wrapToString(Query, function () {
  return 'Query(' + Expr.toString(this.value) + ')';
});

Query.prototype.toJSON = function () {
  return { '@query': this.value };
};

export function wrapToString(
  type: {
    (id: any, collection: any, database: any): void;
    (value: any): void;
    (value: any): void;
    (value: any): void;
    (value: any): void;
    (value: any): void;
    prototype?: any;
  },
  fn: { (): any; (): any; (): string; (): string; (): string; (): string },
) {
  type.prototype.toString = fn;
  type.prototype.inspect = fn;

  if (customInspect) {
    type.prototype[customInspect] = fn;
  }
}
