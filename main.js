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
    if (e || r.statusCode != 302 || r.headers.location != '/') {
      callback(null, null);
      return;
    }

    var o2 = {
      headers: h,
      jar: j
    };
    request.get(u, o2, function(e2, r2, b2) {
      jsdom.env({
        html: b2,
        scripts: [
          'http://code.jquery.com/jquery.min.js'
        ],
        done: function (err, window) {
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
        }
      });
    });
  });
}

module.exports = login
