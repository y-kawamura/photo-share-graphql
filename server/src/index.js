const express = require('express')
const { ApolloServer, gql } = require('apollo-server-express')
const expressPlayground = require('graphql-playground-middleware-express')
  .default
const { readFileSync } = require('fs')
const resolvers = require('./resolvers')

const typeDefs = gql(
  readFileSync(__dirname.concat('/typeDefs.graphql'), 'utf8')
)

const app = express()

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.applyMiddleware({ app })

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
