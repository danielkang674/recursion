// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
  // your code goes here
  let result;
  let copyJSON = json.slice();
  let next = function (str) {
    if (str.length) {
      if (str[0] === '"') {
        return strFunc(str);
      }
      if (str[0] === '{') {
        return objFunc(str);
      } else {
        copyJSON = copyJSON.slice(1);
        return next(copyJSON);
      }
    }
  };
  let strFunc = function (str) {
    let endIndex = str.indexOf('"', 1);
    let tempStr = str.slice(1, endIndex);
    copyJSON = copyJSON.slice(endIndex + 1);
    return tempStr;
  };
  let objFunc = function (str) {
    let tempObj = {};
    copyJSON = str.slice(1, str.length - 1);
    let tempkey = strFunc(copyJSON);
    tempObj[tempkey] = next(copyJSON);
    return tempObj;
  };
  result = next(copyJSON);
  return result;

};
console.log(parseJSON('{"foo":"bar"}')); // correct output
console.log(parseJSON('{"foo":{"bar":"bazz"}}')); // correct output