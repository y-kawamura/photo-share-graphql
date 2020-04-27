const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const expressPlayground = require('graphql-playground-middleware-express')
  .default
const { MongoClient } = require('mongodb')

const { readFileSync } = require('fs')
const resolvers = require('./resolvers')

const typeDefs = gql(
  readFileSync(__dirname.concat('/typeDefs.graphql'), 'utf8')
)

require('dotenv').config()

async function start() {
  const app = express()

  // connect database
  const url = process.env.MONGODB_URI

  const context = {}
  try {
    const client = await MongoClient.connect(url, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
    context.db = client.db()
    console.log('Connected successfully to database')
  } catch (error) {
    console.error(error)
  }

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context
  })
  server.applyMiddleware({ app })

  // routing
  app.get('/', (req, res) => {
    res.end('Welcome to the PhotoShare API')
  })

  app.get('/playground', expressPlayground({ endpoint: '/graphql' }))

  const port = process.env.PORT || 4000
  app.listen(port, () => {
    console.log(
      `🚀 Server ready at http://localhost:${port}${server.graphqlPath}`
    )
  })
}

start()
