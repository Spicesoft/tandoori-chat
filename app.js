var path       = require('path');
var express    = require('express');
var bodyParser = require('body-parser');
var API        = require('./api');

API.configure({
  // Hipchat API access
  admin_token    : '',
  // Hipchat Session access
  admin_email    : '',
  admin_password : '',
  sign_in_url    : 'https://www.hipchat.com/sign_in',
  base_chat_url  : '',
  session_url    : '/chat/session?nonce_auth=1'
});

var app    = express();
var router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

/**********
 * Routes *
 **********/

var i = 0;
var names = ["Loïc Dugast", "Louis Yvon", "Eric Verdier", "Serge Cazenave", "Bruno Rodier", "Yannick Simon", "Raymond Boisseau", "Arnaud Leduc", "Joseph Roy", "Gilles Michon", "Sébastien Maes", "Jean-Michel Husson", "Gilbert Jamet", "Jean-Luc Brault", "Roger Bonneau", "Alexandre Drouot", "David Gros", "Ludovic Ferrand", "Didier Robin", "Gilles Oudin", "Nicolas Portier", "Jean-Luc Capron", "Thierry Barthes", "Romain Felix", "Guillaume Caillaud", "Marcel Lannoy", "André Geffroy", "Emile Loison", "André Larroque", "Emile Demaret", "Jean-Claude Allard", "Loïc Carette", "Olivier Hamard", "Marc Boisseau", "Patrick Guitard", "Hervé Lacoste", "Joseph Blache", "Julien Gentil", "Daniel Lesage", "Patrice Miquel", "Kevin Sarrazin", "Lucien Coco", "Dominique Breton", "Thierry Bou", "Franck Vallon", "Mickaël Prost", "Sébastien Bonnet", "Ludovic Lamarche", "Sébastien Dumont", "Georges Boireau"];

function randInt(m, n) {
  return m + Math.floor((n - m) * Math.random());
}

router.post('/hipchat/user', function (req, res, next) {
  // create hipchat user
  var name  = names[randInt(0, names.length)];
  var uid   = Math.floor((1 + Math.random()) * 0x1000000).toString(16).substring(1);
  var email = name.replace(/[^a-zA-Z]/g, '').toLowerCase() + '-' + uid + '@test.floriancargoet.com';

  API.createUser({
    name  : name,
    email : email
  }, function (err, user) {
    if (err) return next(err);
    res.send({
      success : true,
      user    : user
    });
  });

});

router.get('/hipchat/bosh_url', function (req, res, next) {
  API.getBoshURL(function (err, url) {
    if (err) return next(err);
    res.send({
      success : true,
      bosh_url: url
    })
  })
});

app.use('/', router);

/**********
 * Errors *
 **********/

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  console.log(err);
  res.status(err.status || 500);
  res.send({
    success : false,
    error   : err
  });
});

module.exports = app;
