const { authorizeWithGitHub } = require('../lib')

module.exports = {
  async postPhoto(parent, args, { currentUser, db }) {
    if (!currentUser) {
      throw new Error('only an authorized user can post a photo')
    }
    const newPhoto = {
      ...args.input,
      created: new Date()
    }

    const { insertedId } = await db.collection('photos').insertOne(newPhoto)

    newPhoto.id = insertedId

    return newPhoto
  },

  async githubAuth(parent, { code }, { db }) {
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
      ops: [user]
    } = await db
      .collection('users')
      .replaceOne({ githubLogin: login }, latestUser, { upsert: true })

    return { user, token: access_token }
  }
}
