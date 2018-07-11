// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
  // your code goes here
  const firstLayer = json[0] === '[' ? 'array' : 'object';
  let result;
  let copyJSON = json.slice();
  let next = function (str) {
    if (str.length) {
      if (str[0] === '"') {
        return strFunc(str);
      }
      if (RegExp(/[0-9\-]/).test(str[0])) {
        return numFunc(str);
      }
      if (str[0] === 't' || str[0] === 'f' || str[0] === 'n') {
        return boolFunc(str);
      }
      if (str[0] === '[') {
        return arrayFunc(str);
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
    let endIndex = str.indexOf(',');
    endIndex = endIndex === -1 ? str.indexOf(']') : endIndex;
    endIndex = endIndex === -1 ? str.length : endIndex;
    let tempNum = str.slice(0, endIndex);
    copyJSON = copyJSON.slice(endIndex);
    return Number(tempNum);
  };

  let boolFunc = function (str) {
    if (str.indexOf('true') === 0) {
      let endIndex = 4;
      let tempBool = str.slice(0, endIndex);
      copyJSON = copyJSON.slice(endIndex);
      return true;
    }
    if (str.indexOf('false') === 0) {
      let endIndex = 5;
      let tempBool = str.slice(0, endIndex);
      copyJSON = copyJSON.slice(endIndex);
      return false;
    }
    if (str.indexOf('null') === 0) {
      let endIndex = 4;
      let tempBool = str.slice(0, endIndex);
      copyJSON = copyJSON.slice(endIndex);
      return null;
    }
  };

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
      copyJSON = str.slice(1, str.length);
      if (copyJSON[0] === '}') {
        tempObj = {};
        copyJSON = copyJSON.slice(1);
      } else {
        tempkey = strFunc(copyJSON);
        tempObj[tempkey] = next(copyJSON);
        if (copyJSON[0] === ',' || (copyJSON[0] === '}' && copyJSON[1] === ',' && firstLayer === 'object')) {
          tempObj = objFunc(copyJSON, tempObj);
        }
        if (copyJSON[0] === '}' && copyJSON[1] === ',' && firstLayer === 'array') {
          copyJSON = copyJSON.slice(1);
        }
      }
      return tempObj;
    }
  };

  let arrayFunc = function (str, existingArray) {
    let tempIndex;
    if (existingArray) {
      tempIndex = existingArray.length;
      copyJSON = str.slice(1, str.length);
      existingArray[tempIndex] = next(copyJSON);
      if (copyJSON[0] === ',') {
        existingArray = arrayFunc(copyJSON, existingArray);
      }
      return existingArray;
    } else {
      let tempArray = [];
      copyJSON = str.slice(1, str.length);
      tempIndex = tempArray.length;
      if (copyJSON[0] === ']') {
        tempArray = [];
        copyJSON = copyJSON.slice(1);
      } else {
        tempArray[tempIndex] = next(copyJSON);
        if (copyJSON[0] === ',') {
          tempArray = arrayFunc(copyJSON, tempArray);
        }
      }
      return tempArray;
    }
  };

  let findMatchingBrace = function (str, type) {
    let counter = 1;
    let minusThis, plusThis;
    if (type === 'object') {
      minusThis = '}';
      plusThis = '{';
    } else if (type === 'array') {
      minusThis = ']';
      plusThis = '[';
    } else {
      console.log('error: wrong data type');
    }
    for (let i = 0; i < str.length; i++) {
      if (str[i] === minusThis) {
        counter--;
      } else if (str[i] === plusThis) {
        counter++;
      }
      if (counter === 0) {
        return i;
      }
    }
  };

  result = next(copyJSON);
  return result;

};
console.log(parseJSON('{"a":[],"c": {}, "b": true}'));
