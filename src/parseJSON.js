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
      if (RegExp(/[0-9]/).test(str[0])) {
        return numFunc(str);
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

  let numFunc = function (str) {
    let endIndex = str.search(/[^0-9\.]/);
    endIndex = endIndex === -1 ? str.length : endIndex;
    let tempNum = str.slice(0, endIndex);
    copyJSON = copyJSON.slice(endIndex);
    return tempNum;
  };

  // let boolFunc = function (str) {

  // };

  let objFunc = function (str, existingObj) {
    let tempkey;
    if (existingObj) {
      copyJSON = str.slice(str.indexOf('"'));
      tempkey = strFunc(copyJSON);
      existingObj[tempkey] = next(copyJSON);
      if (copyJSON[0] === ',') {
        existingObj = objFunc(copyJSON, existingObj);
      }
      return existingObj;
    } else {
      let tempObj = {};
      copyJSON = str.slice(1, str.length - 1);
      tempkey = strFunc(copyJSON);
      tempObj[tempkey] = next(copyJSON);
      if (copyJSON[0] === ',') {
        tempObj = objFunc(copyJSON, tempObj);
      }
      return tempObj;
    }
  };

  result = next(copyJSON);
  return result;

};
console.log(parseJSON('{"a":2, "b": 34, "c":1}'));
console.log(parseJSON('{"foo":"bar"}')); // correct output
console.log(parseJSON('{"foo":{"bar":"bazz"}}')); // correct output
console.log(parseJSON('{"a":"b", "c":"d"}')); // correct output
console.log(parseJSON('{"a":"b", "c":{"d": "e"}}')); // correct output
console.log(parseJSON('{"a":"b", "c":{"d": "e"}, "f": 1}')); // correct output
