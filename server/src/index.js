const { ApolloServer, gql } = require('apollo-server')
const { GraphQLScalarType } = require('graphql')

const typeDefs = gql`
  scalar DateTime

  enum PhotoCategory {
    SELFIE
    PORTRAIT
    ACTION
    LANDSCAPE
    GRAPHIC
  }

  type User {
    githubLogin: ID!
    name: String!
    avatar: String
    postedPhotos: [Photo!]!
    inPhotos: [Photo!]!
  }

  type Photo {
    id: ID!
    url: String!
    name: String!
    description: String
    category: PhotoCategory!
    postedBy: User!
    taggedUsers: [User!]!
    created: DateTime!
  }

  input PostPhotoInput {
    name: String!
    category: PhotoCategory = PORTRAIT
    description: String
  }

  type Query {
    hello: String
    totalPhotos: Int!
    allPhotos: [Photo!]!
    allUsers: [User!]!
  }

  type Mutation {
    postPhoto(input: PostPhotoInput!): Photo!
  }
`

let _id = 0
const { users, photos, tags } = require('./sampleData')

const resolvers = {
  Query: {
    hello: () => 'world',
    totalPhotos: () => photos.length,
    allPhotos: () => photos,
    allUsers: () => users
  },

  Mutation: {
    postPhoto(parent, args) {
      const newPhoto = {
        id: _id++,
        ...args.input,
        created: new Date()
      }
      photos.push(newPhoto)
      return newPhoto
    }
  },

  Photo: {
    url: (parent) => `http://penta.com/img/${parent.id}.jpg`,
    postedBy: (parent) => {
      return users.find((user) => user.githubLogin === parent.githubUser)
    },
    taggedUsers: (parent) =>
      tags
        .filter((tag) => tag.photoId === parent.id)
        .map((tag) => users.find((user) => user.githubLogin === tag.userId))
  },

  User: {
    postedPhotos: (parent) => {
      return photos.filter((photo) => photo.githubUser === parent.githubLogin)
    },
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

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`)
})
