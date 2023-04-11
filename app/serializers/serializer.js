const JSONAPISerializer = require('json-api-serializer');
var Serializer = new JSONAPISerializer();

var Serializer = new JSONAPISerializer({
  convertCase: "snake_case",
  unconvertCase: "snake_case",
  convertCaseCacheSize: 0
});

require('./user.serializer')(Serializer);

module.exports.Serializer = Serializer;
