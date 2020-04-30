const fetch = require('node-fetch')
const { authorizeWithGitHub } = require('../lib')

module.exports = {
  async postPhoto(parent, args, { currentUser, db, pubsub }) {
    if (!currentUser) {
      throw new Error('only an authorized user can post a photo')
    }

    const newPhoto = {
      ...args.input,
      userId: currentUser.githubLogin,
      created: new Date()
    }

    const { insertedId } = await db.collection('photos').insertOne(newPhoto)

    newPhoto.id = insertedId

    pubsub.publish('photo-added', { newPhoto })

    return newPhoto
  },

  async githubAuth(parent, { code }, { db, pubsub }) {
    // 1. Get user information from GitHub
    const {
      message,
      access_token,
      login,
      name,
      avatar_url
    } = await authorizeWithGitHub({
      client_id: process.env.GITHUB_CLIENT_ID,
      client_secret: process.env.GITHUB_CLIENT_SECRET,
      code
    })

    // Any error if message exists
    if (message) {
      throw new Error(message)
    }

    // 2. Update database
    const latestUser = {
      githubLogin: login,
      githubToken: access_token,
      name,
      avatar: avatar_url
    }

    const {
      ops: [user],
      result
    } = await db
      .collection('users')
      .replaceOne({ githubLogin: login }, latestUser, { upsert: true })

    result.upserted && pubsub.publish('user-added', { newUser: user })

    return { user, token: access_token }
  },

  async addFakeUsers(parent, { count }, { db, pubsub }) {
    const randomUserApi = `https://randomuser.me/api?results=${count}`
    const { results } = await fetch(randomUserApi)
      .then((res) => res.json())
      .catch((err) => {
        throw new Error(err)
      })

    const users = results.map((r) => ({
      githubLogin: r.login.username,
      githubToken: r.login.sha1,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail
    }))

    await db.collection('users').insertMany(users)

    users.forEach((user) => {
      pubsub.publish('user-added', { newUser: user })
    })

    return users
  },

  async fakeUserAuth(parent, { githubLogin }, { db }) {
    const user = await db.collection('users').findOne({ githubLogin })

    if (!user) {
      throw new Error(`Cannot find user with githubLogin ${githubLogin}`)
    }

    return { user, token: user.githubToken }
  }
}
