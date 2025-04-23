const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;
const User = require('../models/userModel');

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,
    callbackURL: "/api/user/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    const existingUser = await User.findOne({ googleId: profile.id });
    if (existingUser) return done(null, existingUser);
    const user = await User.create({
      name: profile.displayName,
      email: profile.emails[0].value,
      avatar: profile.photos[0].value,
      authProvider: 'google',
      googleId: profile.id
    });
    done(null, user);
  }
));

passport.use(new LinkedInStrategy({
  clientID: process.env.LINKEDIN_CLIENT_ID,
  clientSecret: process.env.LINKEDIN_SECRET,
  callbackURL: "/api/user/auth/linkedin/callback",
  scope: [ 'r_liteprofile']
}, async (accessToken, tokenSecret, profile, done) => {
  const existingUser = await User.findOne({ linkedinId: profile.id });
  if (existingUser) return done(null, existingUser);
  const user = await User.create({
    name: profile.displayName,
    email: profile.emails[0].value,
    avatar: profile.photos?.[0]?.value,
    authProvider: 'linkedin',
    linkedinId: profile.id
  });
  done(null, user);
}));
