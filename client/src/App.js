import React from 'react'
import './App.css'
import { gql } from 'apollo-boost'
import Users from './components/Users'

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    allUsers {
      githubLogin
      name
      avatar
    }
  }
`

const App = () => <Users />

export default App
