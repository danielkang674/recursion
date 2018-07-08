// this is what you would do if you liked things to be easy:
// var stringifyJSON = JSON.stringify;

// but you don't so you're going to write it from scratch:

var stringifyJSON = function(obj) {
  // your code goes here
  let result = '';
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
    let tempArr = obj.map(function(value) {
      return stringifyJSON(value);
    });
    let tempStr = tempArr.join(',');
    result += tempStr;
    result += ']';
  }
  if (typeof obj === 'object' && !Array.isArray(obj) && obj !== null) {
    result += '{';
    let tempArr1 = [];
    for (let key in obj) {
      if (typeof obj[key] !== 'function' && obj[key] !== undefined) {
        tempArr1.push('"' + key + '":' + stringifyJSON(obj[key]));
      }
    }
    let tempStr1 = tempArr1.join(',');
    result += tempStr1;
    result += '}';
  }

  return result;
};
// console.log(stringifyJSON([
//   {
//     'functions': function() {},
//     'undefined': undefined
//   }
// ]));