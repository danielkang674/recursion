// this is what you would do if you were one to do things the easy way:
// var parseJSON = JSON.parse;

// but you're not, so you'll write it from scratch:
var parseJSON = function (json) {
  // your code goes here
  let result;
  let copyJSON = json.slice();
  if (copyJSON.length) {
    let next = function (str) {
      if (str[0] === '"') {
        let endIndex = str.indexOf('"', 1);
        let tempStr = str.slice(1, endIndex);
        strFunc(tempStr);
        copyJSON = copyJSON.slice(endIndex + 1);
      }
      if (str[0] === '{') {
        objFunc(str);
      } else {
        copyJSON = copyJSON.slice(1);
        next(copyJSON);
      }
    };
    let strFunc = function (str) {
      return str;
    };
    let objFunc = function (str) {
      result = {};
      copyJSON = str.slice(1, str.length - 1);
      let tempkey = next(copyJSON);
      result[tempkey] = next(copyJSON); 
    };
  }
  return result;
};
console.log(JSON.parse('{"foo":"bar"}'));