'use strict'


const Thread = use('App/Models/Thread')

class ModifyThreadPolicy {
  async handle ({ params, auth, response }, next) {
    const thread = await Thread.findOrFail(params.id)
    if (thread.user_id !== auth.user.id) {
      return response.forbidden()
    }
    await next()
  }
}

module.exports = ModifyThreadPolicy