const {
  Player
} = require('../models')
const {
  v4: uuidv4
} = require('uuid')

const format = (user) => {
  const {
    id,
    username,
    role
  } = user
  return {
    id,
    username,
    role,
    accessToken: user.generateToken(),
  }
}

const homepage = async (req, res) => res.json({
  info: 'Homepage'
})

const login = async (req, res) => {
  const player = await Player.authenticateUser(req.body)
  res.json(format(player))
}

const register = async (req, res) => {
  const {
    username,
    password
  } = req.body
  await Player.registerUser({
    id: uuidv4(),
    username,
    password,
  })

  res.status(201).json({
    info: 'Register success!'
  })
}

const whoAmI = async (req, res) => await res.json(req.user)

const userLoginForm = async (req, res) => res.render('login')

const userRegisterPage = async (req, res) => res.render('register')

const authenticateAdmin = async (req, res) => {
  const user = await db.Player.authenticateUser(req.body)
  const activeUser = format(user)
  res.render('hello', {
    user: activeUser
  })
}

module.exports = {
  userLoginForm,
  userRegisterPage,
  authenticateAdmin,
  homepage,
  login,
  register,
  whoAmI,
}