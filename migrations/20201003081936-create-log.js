'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('logs', {
      log_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      room_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'rooms',
          key: 'id',
        },
      },
      winner: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      session: {
        type: Sequelize.ARRAY(Sequelize.STRING),
        allowNull: false,
      },
      is_active: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      playing_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('logs')
  },
}
