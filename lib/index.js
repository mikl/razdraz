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
      templateFile = path.join(mediaPath, 'templates', 'index.jade'),
      monolith = require('monolith').init({
        minify: true
      });

  monolith.addCSSFile(path.join(mediaPath, "css", "normalize.css"));
  monolith.addCSSFile(path.join(mediaPath, "css", "razdraz.css"));

  outputData.css = monolith.getCSS();
  outputData.scripts = monolith.getScript();
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

  app.log.info('Displaying words', words);

  return outputData.pageTemplate({
    css: outputData.css,
    footerContent: app.config.get('text:footer'),
    language: app.config.get('text:language'),
    message: words.join(" "),
  });
};

// Extract words from the URL.
module.exports.processURL = function (url) {
  var words = url.split("/");

  return words;
};
