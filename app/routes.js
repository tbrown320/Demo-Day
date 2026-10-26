const ObjectId = require('mongodb').ObjectId
// need the conversation for ObjectId to update and delete routes
module.exports = function (app, passport, db) {

  // normal routes ===============================================================

  // show the home page (will also have our login links)
  app.get('/', function (req, res) {
    res.render('index.ejs');
  });

  // COLLECTION SECTION =========================
  app.get('/profile', isLoggedIn, function (req, res) {
    console.log('filtering by user:', req.user._id)
    //get the array of your own card collection in order of when you got it
    db.collection('cards').find({ userId: req.user._id }).sort({ _id: -1 }).toArray((err, cards) => {
      if (err) return console.log(err)
      //get the total value of your collection
      let totalValue = 0
      cards.forEach(function (c) {
        totalValue += c.pricePaid
      });

      res.render('profile.ejs', {
        user: req.user,
        cards: cards,
        totalValue: totalValue
      })
    })
  });

  // LOGOUT ==============================
  app.get('/logout', function (req, res) {
    req.logout(() => {
      console.log('User has logged out!')
    });
    res.redirect('/');
  });

  // card routes ===============================================================
  // to add a card to the collection
  app.post('/cards', (req, res) => {
    db.collection('cards').insertOne({
      player: req.body.player,
      company: req.body.company,
      cardType: req.body.cardType,
      year: Number(req.body.year),
      set: req.body.set,
      parallel: req.body.parallel,
      grade: req.body.grade,
      pricePaid: Number(req.body.pricePaid),
      userId: req.user._id
    }, (err, result) => {
      if (err) return console.log(err)
      console.log('saved to database')
      res.redirect('/profile')
    })
  })


  app.delete('/cards', (req, res) => {
    db.collection('cards').findOneAndDelete(
      {
        //delete by objectId to get rid of specific 
        _id: ObjectId(req.body.id),
        userId: req.user._id
      }, (err, result) => {
        if (err) return res.send(err)
        res.send('Card sold/deleted!')
      })
  })

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================

  // locally --------------------------------
  // LOGIN ===============================
  // show the login form
  app.get('/login', function (req, res) {
    res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  app.post('/login', passport.authenticate('local-login', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/login', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // SIGNUP =================================
  // show the signup form
  app.get('/signup', function (req, res) {
    res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
    successRedirect: '/profile', // redirect to the secure profile section
    failureRedirect: '/signup', // redirect back to the signup page if there is an error
    failureFlash: true // allow flash messages
  }));

  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future

  // local -----------------------------------
  app.get('/unlink/local', isLoggedIn, function (req, res) {
    var user = req.user;
    user.local.email = undefined;
    user.local.password = undefined;
    user.save(function (err) {
      res.redirect('/profile');
    });
  });
};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
  if (req.isAuthenticated())
    return next();

  res.redirect('/');
}
