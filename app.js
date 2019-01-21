const express = require('express');
const path = require('path');
const app = express();
// Run the app by serving the static files
// in the dist directory
const forceSSL = function() {
  return function(req, res, next) {
    if (req.headers['x-forwarded-proto'] !== 'http') {
      return res.redirect(
        ['http://', req.get('Host'), req.url].join('')
      );
    }
    next();
  }
};
 
// Instruct the app
// to use the forceSSL
// middleware
app.use(forceSSL());

app.use(express.static(__dirname + '/dist/ls-fitness-app'));
// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 3001);
app.get('/*', function(req, res) {
    res.sendFile(path.join(__dirname + '/dist/ls-fitness-app/index.html'));
  });