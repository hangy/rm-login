var request = require('request'),
    jsdom = require('jsdom');

function login(email, password) {
  var j = request.jar(); // No shared/global cookies.
  var f = {
    cookie: 'true',
    login: 'anmelden',
    email: email,
    password: password
  };
  var o = {
    form: f
  };
  var u = 'http://www.readmore.de/index.php?cont=login'  
  
  request.post(u, o, function (e, r, b) {
    jsdom.env({
      html: b,
      scripts: [
        'http://code.jquery.com/jquery.min.js'
      ]
    }, function (err, window) {
      var $ = window.jQuery;

      console.log($('body div.user_band a[href^="index.php?cont=profile&id="]:not([class])').html());
// TODO: something.
    });
  });
}

module.exports = login