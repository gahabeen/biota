import * as values from './values';

export function toJSON(object: any, pretty: any) {
  pretty = typeof pretty !== 'undefined' ? pretty : false;

  if (pretty) {
    return JSON.stringify(object, null, '  ');
  } else {
    return JSON.stringify(object);
  }
}

export function parseJSON(json: string) {
  return JSON.parse(json, json_parse);
}

function json_parse(_: string, val: { [x: string]: any }) {
  if (typeof val !== 'object' || val === null) {
    return val;
  } else if ('@ref' in val) {
    const ref = val['@ref'];

    if (!('collection' in ref) && !('database' in ref)) {
      return values.Native.fromName(ref.id);
    }

    const col = json_parse('collection', ref.collection);
    const db = json_parse('database', ref.database);

    return new values.Ref(ref.id, col, db);
  } else if ('@obj' in val) {
    return val['@obj'];
  } else if ('@set' in val) {
    return new values.SetRef(val['@set']);
  } else if ('@ts' in val) {
    return new values.FaunaTime(val['@ts']);
  } else if ('@date' in val) {
    return new values.FaunaDate(val['@date']);
  } else if ('@bytes' in val) {
    return new values.Bytes(val['@bytes']);
  } else if ('@query' in val) {
    return new values.Query(val['@query']);
  } else {
    return val;
  }
}
