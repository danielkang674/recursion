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
      // more crazy code
      let crazy = next(copyJSON);
      if (crazy !== undefined) {
        existingArray[tempIndex] = crazy;
      }
      // end of crazy code
      if (copyJSON[0] === ',') {
        existingArray = arrayFunc(copyJSON, existingArray);
      }
      return existingArray;
    } else {
      let tempArray = [];
      copyJSON = str.slice(1, str.length);
      tempIndex = tempArray.length;
      if (copyJSON[0] === ']' && str[0] === '[') {
        tempArray = [];
        copyJSON = copyJSON.slice(1);
      } else {
        tempArray[tempIndex] = next(copyJSON);
        if (copyJSON[0] === ',') {
          tempArray = arrayFunc(copyJSON, tempArray);
        }
        // crazy code
        if (copyJSON[0] === '}' || copyJSON[0] === ']') {
          copyJSON = copyJSON.slice(1);
          tempArray = arrayFunc(copyJSON, tempArray);
        }
        // end of crazy code
      }
      return tempArray;
    }
  };

  result = next(copyJSON);
  return result;

};
console.log(parseJSON('{"functions":[' +
  '{"documentation":"Displays a dialog box that allows user to ' +
  'select a folder on the local system.","name":' +
  '"ShowBrowseDialog","parameters":[{"documentation":"The ' +
  'callback function for results.","name":"callback","required":' +
  'true,"type":"callback"}]},{"documentation":"Uploads all mp3 files' +
  ' in the folder provided.","name":"UploadFolder","parameters":' +
  '[{"documentation":"The path to upload mp3 files from."' +
  ',"name":"path","required":true,"type":"string"},{"documentation":' +
  ' "The callback function for progress.","name":"callback",' +
  '"required":true,"type":"callback"}]},{"documentation":"Returns' +
  ' the server name to the current locker service.",' +
  '"name":"GetLockerService","parameters":[]},{"documentation":' +
  '"Changes the name of the locker service.","name":"SetLockerSer' +
  'vice","parameters":[{"documentation":"The value of the locker' +
  ' service to set active.","name":"LockerService","required":true' +
  ',"type":"string"}]},{"documentation":"Downloads locker files to' +
  ' the suggested folder.","name":"DownloadFile","parameters":[{"' +
  'documentation":"The origin path of the locker file.",' +
  '"name":"path","required":true,"type":"string"},{"documentation"' +
  ':"The Window destination path of the locker file.",' +
  '"name":"destination","required":true,"type":"integer"},{"docum' +
  'entation":"The callback function for progress.","name":' +
  '"callback","required":true,"type":"callback"}]}],' +
  '"name":"LockerUploader","version":{"major":0,' +
  '"micro":1,"minor":0},"versionString":"0.0.1"}',
'{ "firstName": "John", "lastName" : "Smith", "age" : ' +
  '25, "address" : { "streetAddress": "21 2nd Street", ' +
  '"city" : "New York", "state" : "NY", "postalCode" : ' +
  ' "10021" }, "phoneNumber": [ { "type" : "home", ' +
  '"number": "212 555-1234" }, { "type" : "fax", ' +
  '"number": "646 555-4567" } ] }',
'{\r\n' +
  '          "glossary": {\n' +
  '              "title": "example glossary",\n\r' +
  '      \t\t"GlossDiv": {\r\n' +
  '                  "title": "S",\r\n' +
  '      \t\t\t"GlossList": {\r\n' +
  '                      "GlossEntry": {\r\n' +
  '                          "ID": "SGML",\r\n' +
  '      \t\t\t\t\t"SortAs": "SGML",\r\n' +
  '      \t\t\t\t\t"GlossTerm": "Standard Generalized ' +
  'Markup Language",\r\n' +
  '      \t\t\t\t\t"Acronym": "SGML",\r\n' +
  '      \t\t\t\t\t"Abbrev": "ISO 8879:1986",\r\n' +
  '      \t\t\t\t\t"GlossDef": {\r\n' +
  '                              "para": "A meta-markup language,' +
  ' used to create markup languages such as DocBook.",\r\n' +
  '      \t\t\t\t\t\t"GlossSeeAlso": ["GML", "XML"]\r\n' +
  '                          },\r\n' +
  '      \t\t\t\t\t"GlossSee": "markup"\r\n' +
  '                      }\r\n' +
  '                  }\r\n' +
  '              }\r\n' +
  '          }\r\n' +
  '      }\r\n'));
