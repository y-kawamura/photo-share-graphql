import React, { Component, Fragment } from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import './App.css'
import { gql } from 'apollo-boost'
import AuthorizedUser from './components/AuthorizedUser'
import { withApollo } from 'react-apollo'
import Users from './components/Users'
import Photos from './components/Photos'
import PostPhoto from './components/PostPhoto'

export const ROOT_QUERY = gql`
  query allUsers {
    totalUsers
    totalPhotos
    allUsers {
      ...userInfo
    }
    allPhotos {
      id
      name
      url
    }
    me {
      ...userInfo
    }
  }

  fragment userInfo on User {
    githubLogin
    name
    avatar
  }
`

const LISTEN_FOR_USERS = gql`
  subscription {
    newUser {
      name
      avatar
      githubLogin
    }
  }
`

const LISTEN_FOR_PHOTOS = gql`
  subscription {
    newPhoto {
      name
      url
    }
  }
`

class App extends Component {
  componentDidMount() {
    const { client } = this.props
    this.listenForUsers = client
      .subscribe({ query: LISTEN_FOR_USERS })
      .subscribe(({ data: { newUser } }) => {
        console.log('subscribe newUser', newUser)
        const data = client.readQuery({ query: ROOT_QUERY })
        client.writeQuery({
          query: ROOT_QUERY,
          data: {
            ...data,
            totalUsers: data.totalUsers + 1,
            allUsers: [...data.allUsers, newUser]
          }
        })
      })

    this.listenForPhotos = client
      .subscribe({ query: LISTEN_FOR_PHOTOS })
      .subscribe(({ data: { newPhoto } }) => {
        console.log('subscribe new photo', newPhoto)
      })
  }

  componentWillUnmount() {
    this.listenForUsers.unsubscribe()
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route
            exact
            path='/'
            component={() => (
              <Fragment>
                <AuthorizedUser />
                <Users />
                <Photos />
              </Fragment>
            )}
          />
          <Route path='/newPhoto' component={PostPhoto} />
          <Route component={() => <h1>Not Found</h1>} />
        </Switch>
      </BrowserRouter>
    )
  }
}

export default withApollo(App)
