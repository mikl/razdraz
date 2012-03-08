"use strict";

var _ = require('underscore'),
    flatiron = require('flatiron'),
    path = require('path'),
    razdraz = require('./lib'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

// Default options defined here.
// These can be overridden by creating a config/config.json file with
// the same format.
app.config.defaults({
  "http": {
    "domainName": "example.net",
    "server": {
      "port": 7000
    }
  },
  "text": {
    "default": "No data makes a poor example.",
    "ending": "an example.",
  }
});

app.use(flatiron.plugins.http);

// This rather ugly route is a catch-all.
// TODO: Find a better way of defining af default route.
app.router.get(/((\w|.)*)/, function () {
  var words = [];

  words = _.union(words, razdraz.processURL(this.req.url));

  // Remove empty strings.
  words = _.filter(words, function (word) {
    return (word.length > 0);
  });

  // If no words were found, show the default text.
  if (!words) {
    words.push(app.config.get('text:default'));
  }
  // Otherwise, add the ending words.
  else {
    // Capitalize the first word.
    words[0] = razdraz.capitalise(words[0]);

    words.push(app.config.get('text:ending'));
  }

  this.res.writeHead(200, { 'Content-Type': 'text/plain' });
  this.res.end(words.join(' '));
});

app.start(app.config.get('http:server:port'));
app.log.info('Razdraz server listening on port ' + app.config.get('http:server:port'));
