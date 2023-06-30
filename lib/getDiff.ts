import { dequal } from 'dequal';

export const getDiff = (origObj: any, newObj: any) => {
  const changes = {};
  for (const key in newObj) {
    if (!origObj.hasOwnProperty(key)) {
      changes[key] = newObj[key];
    } else if (!dequal(origObj[key], newObj[key])) {
      if (typeof origObj[key] === 'object' && typeof newObj[key] === 'object') {
        changes[key] = getDiff(origObj[key], newObj[key]);
      } else {
        changes[key] = newObj[key];
      }
    }
  }
  return changes;
};
