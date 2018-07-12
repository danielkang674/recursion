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
    while (str[endIndex - 1] === '\\') {
      endIndex = str.indexOf('"', endIndex + 1);
    }
    let tempStr = str.slice(1, endIndex);
    copyJSON = copyJSON.slice(endIndex + 1);
    if (tempStr.length >= 2) {
      let anotherTempStr = '';
      for (let i = 0; i < tempStr.length; i++) {
        if (tempStr[i] === '\\') {
          anotherTempStr += tempStr[i + 1];
          i++;
        } else {
          anotherTempStr += tempStr[i];
        }
      }
      tempStr = anotherTempStr;
    }
    return tempStr;
  };

  let numFunc = function (str) {
    let numnum = '';
    let tempIndexNum = 0;
    while (true) {
      if (/[0-9\.\-]/.test(str[tempIndexNum])) {
        numnum += str[tempIndexNum];
        tempIndexNum++;
      } else {
        break;
      }
    }
    copyJSON = copyJSON.slice(tempIndexNum);
    return Number(numnum);
  };

  let boolFunc = function (str) {
    let endIndex;
    if (str.indexOf('true') === 0) {
      endIndex = 4;
      copyJSON = copyJSON.slice(endIndex);
      return true;
    }
    if (str.indexOf('false') === 0) {
      endIndex = 5;
      copyJSON = copyJSON.slice(endIndex);
      return false;
    }
    if (str.indexOf('null') === 0) {
      endIndex = 4;
      copyJSON = copyJSON.slice(endIndex);
      return null;
    }
  };

  let objFunc = function (str, existingObj) {
    let tempkey;
    if (existingObj) {
      while (true) {
        copyJSON = trimWhiteSpace(copyJSON);
        //stop bugs and infitine loops
        if (copyJSON.length < 1) {
          break;
        }
        if (copyJSON[0] === '}') {
          break;
        }
        copyJSON = str.slice(str.indexOf('"'));
        tempkey = strFunc(copyJSON);
        existingObj[tempkey] = next(copyJSON);
        existingObj = objFunc(copyJSON, existingObj);
      }
      return existingObj;
    } else {
      let tempObj = {};
      copyJSON = str.slice(1, str.length);
      if (copyJSON[0] === '}' && str[0] === '}') {
        tempObj = {};
        copyJSON = copyJSON.slice(1);
      } else {
        while (true) {
          copyJSON = trimWhiteSpace(copyJSON);
          //stop bugs and infitine loops
          if (copyJSON.length < 1) {
            break;
          }
          if (copyJSON[0] === '}') {
            break;
          }
          tempkey = strFunc(copyJSON);
          tempObj[tempkey] = next(copyJSON);
          tempObj = objFunc(copyJSON, tempObj);
        }
      }
      copyJSON = copyJSON.slice(1);
      return tempObj;
    }
  };

  let arrayFunc = function (str, existingArray) {
    let tempIndex;
    if (existingArray) {
      tempIndex = existingArray.length;
      while (true) {
        copyJSON = trimWhiteSpace(copyJSON);
        //stop bugs and infitine loops
        if (copyJSON.length < 1 && copyJSON[0] !== ']') {
          throw SyntaxError('Unable to parse json');
        }
        if (copyJSON[0] === ']') {
          break;
        }
        copyJSON = str.slice(1);
        existingArray[tempIndex] = next(copyJSON);
        existingArray = arrayFunc(copyJSON, existingArray);
      }
      return existingArray;
    } else {
      let tempArray = [];
      copyJSON = str.slice(1);
      tempIndex = tempArray.length;
      if (copyJSON[0] === ']' && str[0] === '[') {
        tempArray = [];
        // copyJSON = copyJSON.slice(1);
      } else {
        while (true) {
          copyJSON = trimWhiteSpace(copyJSON);
          //stop bugs and infitine loops
          if (copyJSON.length < 1) {
            break;
          }
          if (copyJSON[0] === ']') {
            break;
          }
          tempArray[tempIndex] = next(copyJSON);
          tempArray = arrayFunc(copyJSON, tempArray);
        }
      }
      copyJSON = copyJSON.slice(1);
      return tempArray;
    }
  };

  let trimWhiteSpace = function (str) {
    while (/\s/.test(str[0])) {
      str = str.slice(1);
    }
    return str;
  };

  result = next(copyJSON);
  return result;

};
