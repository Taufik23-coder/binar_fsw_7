const AccessControl = require('accesscontrol')
const ac = new AccessControl()

ac.grant('player')
  .grant('admin')
  .extend('player')
  .createAny(['rooms', 'players', 'logs', 'create-room'])
  .readAny(['rooms', 'players', 'logs'])
  .updateAny(['rooms', 'players', 'logs'])
  .deleteAny(['rooms', 'players', 'logs'])

module.exports = ac
