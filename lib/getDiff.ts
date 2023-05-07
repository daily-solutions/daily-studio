import { isArray, isEqual, isObject, transform } from 'lodash';

export const getDiff = (origObj: any, newObj: any) => {
  function changes(newObj: any, origObj: any) {
    let arrayIndexCounter = 0;
    return transform(newObj, function (result: any, value: any, key: number) {
      if (!isEqual(value, origObj[key])) {
        let resultKey = isArray(origObj) ? arrayIndexCounter++ : key;
        result[resultKey] =
          isObject(value) && isObject(origObj[key])
            ? changes(value, origObj[key])
            : value;
      }
    });
  }
  return changes(newObj, origObj);
};
