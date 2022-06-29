const isValid = function (value) {
    if (typeof value === "undefined" || value === null) return false;
    if (typeof value === "string" && value.trim().length === 0) return false;
    return true;
  };
  
//   function isValidUrl(x){
//     const regEx = /((http|https)://)(www.)?” + “[a-zA-Z0-9@:%._\\+~#?&//=]{2,256}\\.[a-z]” + “{2,6}\\b([-a-zA-Z0-9@:%._\\+~#?&//=]*)/  
//     const result = regEx.test(x)
//     return result;
// }