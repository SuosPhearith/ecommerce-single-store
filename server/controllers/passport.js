const Account = require("../models/accountModel");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await Account.findOne({
          googleId: profile.id,
        });

        if (existingUser) {
          // Handle the existing user
          return done(null, existingUser);
        } else {
          // Create a new user
          const newAccount = new Account({
            googleId: profile.id,
            fullname: profile.displayName,
            email: profile.emails[0].value,
            profile: profile.photos[0].value,
          });

          await newAccount.save();
          return done(null, newAccount);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/api/v1/auth/facebook/callback",
      profileFields: [
        "id",
        "displayName",
        "name",
        "gender",
        "picture.type(large)",
        "email",
      ],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const existingUser = await Account.findOne({
          googleId: profile.id,
        });

        if (existingUser) {
          // Handle the existing user
          return done(null, existingUser);
        } else {
          // Create a new user
          const newAccount = new Account({
            facebookId: profile.id,
            fullname: profile.displayName,
            profile: profile.photos[0].value,
          });

          await newAccount.save();
          return done(null, newAccount);
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await Account.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

module.exports = passport;
