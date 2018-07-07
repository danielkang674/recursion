// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  let result = '';
  if (typeof obj === 'function' || typeof obj === 'undefined') {
    return undefined;
  }
  if (typeof obj === 'number' || typeof obj === 'boolean' || typeof obj === 'string' || obj === null) {
    if (obj === null) {
      result += 'null';
    }
    if (typeof obj === 'string') {
      result += '"' + obj + '"';
    }
    if (typeof obj === 'number' || typeof obj === 'boolean') {
      result += obj.toString();
    }
  }
  if (Array.isArray(obj)) {
    result += '[';
    // let tempArr = [];
    // for (let i = 0; i < obj.length; i++) {
    //   tempArr.push(stringifyJSON(obj[i]));
    // }
    let tempArr = obj.map(function(value) {
      return stringifyJSON(value);
    });
    let tempStr = tempArr.join(',');
    result += tempStr;
    result += ']';
  }
  return result;
};
console.log(stringifyJSON({a: 1, 2: 2, c: 'd'}));