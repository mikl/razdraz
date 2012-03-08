"use strict";

// Capitalise a word.
module.exports.capitalise = function (string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

// Extract words from the URL.
module.exports.processURL = function (url) {
  var words = url.split("/");

  return words;
};
