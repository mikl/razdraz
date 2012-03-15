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
    "bannedWords": [ 'dippenade' ],
    "default": "No data makes a poor example.",
    "ending": "an example.",
    "footer": 'Powered by <a href="https://github.com/mikl/razdraz">Razdraz</a>, created by the friendly folks at <a href="http://revealit.dk/">Reveal IT</a>.',
    "language": "en",
    "refusal": "Nuh, uh." // For when banned words are entered.
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
  if (words.length < 1) {
    words.push(app.config.get('text:default'));
  }
  else if (_.intersection(words, app.config.get('text:bannedWords')).length > 0) {
    app.log.warn('Banned word found', words);
    words = [app.config.get('text:refusal')];
  }
  // Otherwise, add the ending words.
  else {
    // Capitalize the first word.
    words[0] = razdraz.capitalise(words[0]);

    words.push(app.config.get('text:ending'));
  }

  this.res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  this.res.end(razdraz.page(words));
});

app.start(app.config.get('http:server:port'));
app.log.info('Razdraz server listening on port ' + app.config.get('http:server:port'));
