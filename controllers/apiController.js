const db = require('../models')
const {
  v4: uuidv4
} = require('uuid')
const ac = require('../lib/roles')
const cache = require('memory-cache')

const getAllPlayers = async (req, res) => {
  const permission = await ac.can(req.user.role).readAny('players')
  if (!permission.granted) throw new Error('NoPermission')

  const players = await db.Player.findAll({
    include: [db.Room],
    where: {
      role: 'player',
    },
  })
  res.json({
    players
  })
}

const getAllRooms = async (req, res) => {
  const permission = await ac.can(req.user.role).readAny('rooms')
  if (!permission.granted) throw new Error('NoPermission')

  const rooms = await db.Room.findAll({
    include: [db.Log],
  })
  res.json({
    rooms
  })
}

const createRoom = async (req, res) => {
  const room = await db.Room.create({
    id: uuidv4(),
    creator: req.user.id,
    name: req.body.name,
  })
  res.status(201).json({
    room: room.id
  })
}

const fightRoom = async (req, res) => {
  const room_id = req.params.room
  const room = await db.Room.findOne({
    where: {
      id: room_id
    },
    include: [db.Log],
  })
  if (!room)
    res
    .status(404)
    .json({
      info: "Room doesn't exist. Please create new room first."
    })

  let activeLog = await db.Log.findOne({
    where: {
      room_id: room_id,
    },
  })

  if (room && !activeLog) {
    await db.Log.create({
      log_id: uuidv4(),
      room_id: room_id,
      winner: [],
      session: [req.user.id],
      is_active: true,
      playing_date: new Date(),
    })
    cache.put(req.params.room, [])
    res.json({
      info: 'You joined this room'
    })
  } else if (room && activeLog.session.length < 2) {
    const duplicateUser = await activeLog.session.some((i) => i === req.user.id)
    if (duplicateUser)
      res.status(202).json({
        info: 'You are in the room right now.'
      })
    else if (!duplicateUser) {
      const session = activeLog.session.concat(req.user.id)

      await db.Log.update({
        session: session,
      }, {
        where: {
          log_id: activeLog.log_id,
        },
      })

      res.json({
        info: 'You joined this room'
      })
    }
  } else if (room && activeLog.session.length === 2) {
    const duplicateUser = await activeLog.session.some((i) => i === req.user.id)
    if (duplicateUser)
      res.status(202).json({
        info: 'You are in the room right now.'
      })
    else
      res.status(404).json({
        info: 'Room is full. Please join other room or create new room.',
      })
  } else
    res.status(404).json({
      info: 'Room is full. Please join other room or create new room.',
    })
}

// Extra Feature
const playGame = async (req, res) => {
  const log = await db.Log.findOne({
    where: {
      room_id: req.params.room,
      is_active: true,
    },
  })

  const player = log.session.includes(req.user.id)
  if (!player)
    throw new Error(
      'You are not registered to this room. Please join another room.'
    )

  let game = cache.get(req.params.room)
  if (game.length < 2) {
    const player = req.user.id
    game.push({
      player: player,
      option: req.body.option,
    })
    cache.put(req.params.room, game)
  }

  res.json(game)
}

// Extra feature
const showResult = async (res, req) => {
  // get cache with params room
  // compare the inputs
  // empty cache
  // showResult (each round and the winner)
  const choice = ['paper', 'rock', 'scissors']
  const WIN_TABLE = [
    ['d', 'p1', 'p2'],
    ['p2', 'd', 'p1'],
    ['p1', 'p2', 'd'],
  ]

  const game = cache.get(req.params.room)
  const player1Choice = choice.indexOf(game[0].option.toLowerCase())
  const player2Choice = choice.indexOf(game[1].option.toLowerCase())
  const result = WIN_TABLE[player1Choice][player2Choice]
  const player1 = Object.keys(game[0])[0]
  const player2 = Object.keys(game[1])[0]
  let roundWinner

  switch (result) {
    case 'd':
      roundWinner = 'draw'
    case 'p1':
      roundWinner = player1
    case 'p2':
      roundWinner = player2
  }

  let gameResult = await db.Log.findOne({
    where: {
      room_id: req.params.room,
    },
  })

  gameResult.winner.push(roundWinner)

  await db.Log.update({
    winner: gameResult.winner,
  })

  // show winner
  res.json({
    winner: gameResult.winner
  })
}

module.exports = {
  getAllPlayers,
  getAllRooms,
  createRoom,
  fightRoom,
  playGame,
  showResult,
}