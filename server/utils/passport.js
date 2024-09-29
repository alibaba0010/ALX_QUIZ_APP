import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import dotenv from "dotenv";
dotenv.config();
import User from "../models/userDB";
passport.serializeUser((user, done) => {
  done(null, user.id);
});
passport.deserializeUser((id, done) => {
  User.findById(id).then((user) => {
    done(null, user);
  });
});
export default passport.use(
  new GoogleStrategy(
    {
      callbackURL: "/auth/google/redirect",
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      scope: ["profile"],
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("Access Token: ", accessToken);
      console.log("Profile: ", profile);
      const { id, displayName } = profile;
      User.findOne({ googleId: id }).then((currentUser) => {
        if (currentUser) {
          console.log("In current User: ", currentUser);

          return done(null, currentUser);
        } else {
          new User({
            username: displayName,
            googleId: id,
            thumbnail: profile._json.picture,
          })
            .save()
            .then((newUser) => {
              console.log("New User created: ", newUser);
              return done(null, newUser);
            });
        }
      });
    }
  )
);
