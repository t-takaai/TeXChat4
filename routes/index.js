var express = require('express');
var passport = require('passport');
var router = express.Router();

/* GET index */

router.get('/', function(req, res, next) {
  console.log("GET / req.user:", req.user);
  var displayName = "Anonymous";
  if (req.user) {
    displayName = req.user.displayName;
    res.render('index', {
      title: "TeXChat",
      displayName: displayName
    });
  } else {
    res.render('login', {
      title: "Google OAuth",
      displayName: displayName
    });
  }
});

/* for Google OAuth link. */
router.get('/auth/google', passport.authenticate('google', {
    scope: ['https://www.googleapis.com/auth/plus.login']
  }),
  function(req, res) {} // this never gets called
);

/* for the callback of Google OAuth */
router.get('/oauth2callback', passport.authenticate('google', {
  successRedirect: '/',
  failureRedirect: '/login'
}));

/* You can GET this page after authenticated. */
// router.get('/api',
//   ensureAuthenticated,
//   function(req, res) {
//     res.json({
//       message: "You are authenticated!"
//     });
//   }
// );

/* logout */
// router.get('/logout', function(req, res) {
//   req.logout();
//   res.redirect('/');
// });

// check whether authenticated or not
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.sendStatus(401);
}

module.exports = router;
