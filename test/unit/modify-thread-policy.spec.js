'use strict'


const { test, trait, before } = use('Test/Suite')('Modify Thread Policy')

const Route = use('Route')
const Factory = use('Factory')

trait('Test/ApiClient')
trait('Auth/Client')
trait('DatabaseTransactions')

use('Test/Suite')('Modify Thread Policy')

before(() => {
  const action = ({ response }) => response.json({ ok: true })
  Route.post('test/modify-thread-policy/:id', action).middleware(['auth', 'modifyThreadPolicy'])
})
test('non creator of a thread cannot modify it', async ({ assert, client }) => {
  const action = ({ response }) => response.json({ ok: true })
  const thread = await Factory.model('App/Models/Thread').create()
  const notOwner = await Factory.model('App/Models/User').create()
  let response = await client.post(`test/modify-thread-policy/${thread.id}`).loginVia(notOwner).send().end()
  console.log(response.error)
  response.assertStatus(403)
})

before(() => {
  const action = ({ response }) => response.json({ ok: true })
  Route.post('test/modify-thread-policy/:id', action).middleware(['auth', 'modifyThreadPolicy'])
})
test('creator of a thread can modify it', async ({ assert, client }) => {
  const action = ({ response }) => response.json({ ok: true })

  const thread = await Factory.model('App/Models/Thread').create()
  const owner = await thread.user().first()
  let response = await client.post(`test/modify-thread-policy/${thread.id}`).loginVia(owner).send().end()
  response.assertStatus(200)
})
