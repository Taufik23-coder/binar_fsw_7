const passport = require('passport')
const {
  Strategy: jwtStrategy,
  ExtractJwt
} = require('passport-jwt')
const {
  Player
} = require('../models')
require('dotenv').config()

const options = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: process.env.SECRET,
}

passport.use(
  new jwtStrategy(options, async (payload, done) => {
    try {
      const user = await Player.findByPk(payload.id)
      return done(null, {
        info: `You are ${user.username}`,
        id: user.id,
        role: user.role,
      })
    } catch (error) {
      return done(error, false)
    }
  })
)

module.exports = passport