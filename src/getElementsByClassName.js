// If life was easy, we could just do things the easy way:
// var getElementsByClassName = function (className) {
//   return document.getElementsByClassName(className);
// };

// But instead we're going to implement it from scratch:
var getElementsByClassName = function(className) {
  // your code here

  let classNodes = [];

  let inner = function(className, domNode) {
    let temp = domNode.children;
    let tempArr = Array.from(temp);
    for (let value of tempArr) {
      
    }
  }
};