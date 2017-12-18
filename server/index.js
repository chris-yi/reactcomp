//COMP 72C

require('dotenv').config();

const express = require('express'),
  bodyParser = require('body-parser'),
  session = require('express-session'),
  passport = require('passport'),
  Auth0Strategy = require('passport-auth0'),
  massive = require('massive'),
  cors = require('cors');



//COMP 74C
const app = express();
//COMP 76F
app.use(bodyParser.json());
app.use(cors());


//////// AUTH0
app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());



//COMP 70C
massive(process.env.CONNECTION_STRING).then((db) => {
console.log('connected');
//COMP 70F
app.set('db', db);
});



passport.use(new Auth0Strategy({
  domain: process.env.AUTH_DOMAIN,
  clientID: process.env.AUTH_CLIENTID,
  clientSecret: process.env.AUTH_CLIENTSECRET,
  callbackURL: process.env.AUTH_CALLBACK,
}, function (accessToken, refreshToken, extraParams, profile, done) {
  // check if the user exists in users table
  // if they do, invoke done with user's id
  // if not, then we will create new user
  // then invoke done with new user's id
  const db = app.get('db');
  const userData = profile._json;

  db.find_user([userData.identities[0].user_id]).then(user => {
    // console.log(userData);
    if (user[0]) {
      return done(null, user[0].user_id);
    } else {
      db.create_user([
        userData.given_name,
        userData.family_name,
        userData.email,
        userData.picture,
        userData.identities[0].user_id,
      ]).then(user => {
        return done(null, user[0].user_id);
      });
    }
  });
}));

passport.serializeUser(function (id, done) {
  done(null, id);
});
passport.deserializeUser(function (id, done) {
  app.get('db').find_session_user([id]).then((user) => {
    done(null, user[0]); //placed on req.user  })
  });
});

app.get('/auth', passport.authenticate('auth0'));

app.get('/auth/callback', passport.authenticate('auth0', {
  successRedirect: process.env.REDIRECT_SUCCESS,
  failureRedirect: process.env.REDIRECT_FAILURE,
}));

app.get('/auth/me', (req, res) => {
  if (req.user) {
    return res.status(200).send(req.user);
  } else {
    return res.status(401).send('Not logged in.');
  }
});

app.get('/auth/logout', (req, res) => {
  req.logout();
  res.redirect('http://localhost:3000/');
});



const PORT = 8080;
app.listen(PORT, () => console.log(`Server is listening on port: ${PORT}`));
