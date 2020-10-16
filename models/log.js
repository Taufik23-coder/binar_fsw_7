'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Log extends Model {
    static associate(models) {
      this.belongsTo(models.Room, {
        foreignKey: 'room_id',
      })
    }
  }
  Log.init(
    {
      log_id: {
        primaryKey: true,
        type: DataTypes.UUID,
      },
      room_id: DataTypes.UUID,
      winner: DataTypes.ARRAY(DataTypes.STRING),
      session: DataTypes.ARRAY(DataTypes.STRING),
      is_active: DataTypes.BOOLEAN,
      playing_date: DataTypes.DATE,
    },
    {
      sequelize,
      timestamps: false,
      modelName: 'Log',
      tableName: 'logs',
    }
  )

  return Log
}
