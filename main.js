var request = require('request'),
    jsdom = require('jsdom'),
    url = require('url');

function login(req, email, password, callback) {
  var j = request.jar(); // No shared/global cookies.
  var f = {
    cookie: 'true',
    login: 'anmelden',
    email: email,
    password: password
  };
  var h = {
    "X-Forwarded-For": req.ip
  };
  var o = {
    headers: h,
    form: f,
    jar: j
  };
  var u = 'http://www.readmore.de/index.php?cont=login'  
  
  request.post(u, o, function (e, r, b) {
    if (e || !b) {
      callback(null, null);
      return;
    }

    jsdom.env({
      html: b,
      scripts: [
        'http://code.jquery.com/jquery.min.js'
      ]
    }, function (err, window) {
      if (err) {
        callback(null, null);
        return;
      }

      var $ = window.jQuery;

      var link = $('body div.user_band a[href^="index.php?cont=profile"]').last();
      var href = $(link).attr('href');
      var id = url.parse(href, true).query.id;
      var nick = $(link).text();
      callback(id, nick);
    });
  });
}

module.exports = login
