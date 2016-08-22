module StockChart {

  export function mixins(target: Object, ...sources) {
    if (target === undefined || target === null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }

    let output = Object(target);
    for (let index = 0; index < sources.length; index++) {
      let source = sources[index];
      if (source !== undefined && source !== null) {
        for (let nextKey in source) {
          if (source.hasOwnProperty(nextKey)) {
            output[nextKey] = source[nextKey];
          }
        }
      }
    }
    return output;
  }

  export function arrayObjectIndexOf(array: Object[], property: string, expectedValue: any): number {
    const len = array.length
    for (let i = 0; i < len; i++) {
      if (array[i][property] === expectedValue) {
        return i
      }
    }
    return -1
  }

}
