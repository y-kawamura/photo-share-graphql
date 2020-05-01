const { GraphQLScalarType } = require('graphql')

module.exports = {
  Photo: {
    id: (parent) => parent.id || parent._id,

    url: (parent) => `/img/photos/${parent._id}.jpg`,

    postedBy: (parent, args, { db }) =>
      db.collection('users').findOne({ githubLogin: parent.userId }),

    taggedUsers: async (parent, args, { db }) => {
      const currentPhotoTags = await db
        .collection('tags')
        .find({ photoId: parent._id })
        .toArray()
      const githubLogins = currentPhotoTags.map((tag) => tag.githubLogin)

      return db
        .collection('users')
        .find({ githubLogin: { $in: githubLogins } })
        .toArray()
    }
  },

  User: {
    postedPhotos: (parent, args, { db }) =>
      db.collection('photos').find({ userId: parent.githubLogin }).toArray(),

    inPhotos: async (parent, args, { db }) => {
      const currentUserTags = await db
        .collection('tags')
        .find({ githubLogin: parent.githubLogin })
        .toArray()
      const photoIDs = currentUserTags.map((tag) => tag.photoId)
      return db
        .collection('photos')
        .find({ _id: { $in: photoIDs } })
        .toArray()
    }
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value
  })
}
