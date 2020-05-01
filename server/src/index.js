const express = require('express')
const { MongoClient } = require('mongodb')
const { readFileSync } = require('fs')
const { ApolloServer, gql, PubSub } = require('apollo-server-express')
const { createServer } = require('http')
const resolvers = require('./resolvers')
const depthLimit = require('graphql-depth-limit')
const expressPlayground = require('graphql-playground-middleware-express')
  .default

require('dotenv').config()
const typeDefs = gql(
  readFileSync(__dirname.concat('/typeDefs.graphql'), 'utf8')
)

async function start() {
  const app = express()

  // connect database
  const url = process.env.MONGODB_URI

  let db
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    db = client.db()
    console.log('Connected successfully to database')
  } catch (error) {
    console.error(error)
  }

  const pubsub = new PubSub()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    validationRules: [depthLimit(5)],
    context: async ({ req, connection }) => {
      const githubToken = req
        ? req.headers.authorization
        : connection.context.Authorization
      currentUser = await db.collection('users').findOne({ githubToken })
      return { currentUser, db, pubsub }
    }
  })
  server.applyMiddleware({ app })

  // routing
  app.get('/', (req, res) => {
    res.end('Welcome to the PhotoShare API')
  })

  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  app.use('/img/photos', express.static(__dirname.concat('/assets/photo')))

  const httpServer = createServer(app)
  server.installSubscriptionHandlers(httpServer)
  httpServer.timeout = 5000

  const port = process.env.PORT || 4000
  httpServer.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    )
    console.log(
      `🚀 Subscriptions ready at ws://localhost:${port}${server.subscriptionsPath}`
    )
  })
}

start()
