import ModelUser from "../database/mongo/models/user";

require("dotenv").config();

const passport = require("passport");
const passportJwt = require("passport-jwt");
const { Strategy, ExtractJwt } = passportJwt;

const params = {
  secretOrKey: process.env.SECRET,
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
};

const strategy = new Strategy(params, (payload, done) => {
  ModelUser.findById(payload.id, function(err, doc) {
    if (err) return done(err, false);
    return done(null, doc ? { ...payload } : false);
  });
});

passport.use(strategy);

export const authenticate = passport.authenticate("jwt", { session: false });
