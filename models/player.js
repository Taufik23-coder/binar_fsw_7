'use strict'
const { Model } = require('sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config()

module.exports = (sequelize, DataTypes) => {
  class Player extends Model {
    static associate(models) {
      this.hasMany(models.Room, {
        foreignKey: 'creator',
      })
    }

    static #encryptPassword = (password) => bcrypt.hashSync(password, 10)

    static registerUser = ({ id, username, password }) => {
      const hashedPassword = this.#encryptPassword(password)
      console.log(hashedPassword)
      return this.create({ id, username, password: hashedPassword })
    }

    checkPassword = (password) => bcrypt.compareSync(password, this.password)

    generateToken = () => {
      const payload = {
        id: this.id,
        username: this.username,
        role: this.role,
      }

      return jwt.sign(payload, process.env.SECRET)
    }

    static authenticateUser = async ({ username, password }) => {
      try {
        const user = await this.findOne({ where: { username } })
        if (!user) throw Error('User does not exist.')
        const passwordCorrect = await user.checkPassword(password)
        if (!passwordCorrect) throw Error('Wrong password!')

        return Promise.resolve(user)
      } catch (error) {
        return Promise.reject(error)
      }
    }
  }

  Player.init(
    {
      id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      role: DataTypes.STRING,
      createdAt: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Player',
      tableName: 'user_game',
    }
  )

  return Player
}
