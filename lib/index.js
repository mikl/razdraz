"use strict";

var flatiron = require('flatiron'),
    fs = require('fs'),
    jade = require('jade'),
    path = require('path'),
    app = flatiron.app;

var outputData = {};

// Prepare for markup output.
// Collect static assets and precompile templates.
var prepareOutput = function () {
  var mediaPath = path.join(__dirname, '..', 'media'),
      templateFile = path.join(mediaPath, 'templates', 'index.jade');

  outputData.pageTemplate = jade.compile(fs.readFileSync(templateFile, 'utf-8'));
};

// Capitalise a word.
module.exports.capitalise = function (string) {
  return string.charAt(0).toUpperCase() + string.substring(1);
};

// Generate the HTML page we use for diplaying the message.
module.exports.page = function (words) {
  if (!outputData.pageTemplate) {
    prepareOutput();
  }

  return outputData.pageTemplate({
    footerContent: app.config.get('text:footer'),
    language: app.config.get('text:language'),
    message: words.join(" "),
    pageTitle: words.join(" "),
  });
};

// Extract words from the URL.
module.exports.processURL = function (url) {
  var words = url.split("/");

  return words;
};
