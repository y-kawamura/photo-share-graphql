import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import * as serviceWorker from './serviceWorker'

import { ApolloProvider } from 'react-apollo'
import { InMemoryCache, ApolloLink, ApolloClient, split } from 'apollo-boost'
import { WebSocketLink } from 'apollo-link-ws'
import { persistCache } from 'apollo-cache-persist'
import { getMainDefinition } from 'apollo-utilities'
import { SubscriptionClient } from 'subscriptions-transport-ws'
import { createUploadLink } from 'apollo-upload-client'

// cache
const cache = new InMemoryCache()
persistCache({
  cache,
  storage: localStorage
})

if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
  cache.restore(cacheData)
}

// link
const httpLink = createUploadLink({ uri: 'http://localhost:4000/graphql' })
const authLink = new ApolloLink((operation, forward) => {
  operation.setContext((context) => ({
    headers: {
      ...context.headers,
      authorization: localStorage.getItem('token')
    }
  }))
  return forward(operation)
})
const httpAuthLink = authLink.concat(httpLink)

const clientWS = new SubscriptionClient('ws://localhost:4000/graphql', {
  reconnect: true
})
const wsLink = new WebSocketLink(clientWS)

const link = split(
  ({ query }) => {
    console.log('check', query)
    const { kind, operation } = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpAuthLink
)

const client = new ApolloClient({
  cache,
  link
})

ReactDOM.render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  </React.StrictMode>,
  document.getElementById('root')
)

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
