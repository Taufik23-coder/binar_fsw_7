const Router = require('express-promise-router')
const router = new Router()
const controller = require('../controllers/apiController')
const restrict = require('../utils/restrict')

router.get('/players', restrict, controller.getAllPlayers)
router.get('/rooms', restrict, controller.getAllRooms)
router.post('/create-room', restrict, controller.createRoom)
router.post('/fight/:room', restrict, controller.fightRoom)
// extra features
router.post('/fight/play/:room', restrict, controller.playGame)
router.post('/fight/result/:room', restrict, controller.showResult)

module.exports = router