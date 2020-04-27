const { GraphQLScalarType } = require('graphql')
const { users, photos, tags } = require('../sampleData')

module.exports = {
  Photo: {
    url: (parent) => `http://penta.com/img/${parent.id}.jpg`,
    postedBy: (parent) =>
      users.find((user) => user.githubLogin === parent.githubUser),
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoId === parent.id)
        .map((tag) => users.find((user) => user.githubLogin === tag.userId))
  },

  User: {
    postedPhotos: (parent) =>
      photos.filter((photo) => photo.githubUser === parent.githubLogin),
    inPhotos: (parent) =>
      tags
        .filter((tag) => tag.userId === parent.githubLogin)
        .map((tag) => photos.find((photo) => photo.id === tag.photoId))
  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value',
    parseValue: (value) => new Date(value),
    serialize: (value) => new Date(value).toISOString(),
    parseLiteral: (ast) => ast.value
  })
}
