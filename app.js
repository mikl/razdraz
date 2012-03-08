"use strict";

var flatiron = require('flatiron'),
    path = require('path'),
    app = flatiron.app;

app.config.file({ file: path.join(__dirname, 'config', 'config.json') });

// Default options defined here.
// These can be overridden by creating a config/config.json file with
// the same format.
app.config.defaults({
  "http": {
    "server": {
      "port": 7000
    }
  }
});

app.use(flatiron.plugins.http);

app.router.get('/', function () {
  this.res.json({ 'hello': 'world' });
});

app.start(app.config.get('http:server:port'));
app.log.info('Razdraz server listening on port ' + app.config.get('http:server:port'));
