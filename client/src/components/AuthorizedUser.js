import React, { Component } from 'react'
import { withRouter, NavLink } from 'react-router-dom'
import { gql } from 'apollo-boost'
import { Mutation, Query, withApollo } from 'react-apollo'
import { ROOT_QUERY } from '../App'
import { compose } from 'recompose'

const GITHUB_AUTH_MUTATION = gql`
  mutation githubAuth($code: String!) {
    githubAuth(code: $code) {
      token
    }
  }
`

const Me = ({ logout, requestCode, signingIn }) => (
  <Query query={ROOT_QUERY}>
    {({ data, loading }) =>
      loading ? (
        <p>loading...</p>
      ) : data.me ? (
        <CurrentUser {...data.me} logout={logout} />
      ) : (
        <button onClick={requestCode} disabled={signingIn}>
          Sign in with GitHub
        </button>
      )
    }
  </Query>
)

const CurrentUser = ({ name, avatar, logout }) => (
  <div>
    <img src={avatar} alt={name} widht='48' height='48' />
    <h1>{name}</h1>
    <button onClick={logout}>Logout</button>
    <NavLink to='/newPhoto'>Post Photo</NavLink>
  </div>
)

class AuthorizedUser extends Component {
  state = { signingIn: false }

  authorizationComplete = (cache, { data }) => {
    localStorage.setItem('token', data.githubAuth.token)
    this.props.history.replace('/')
    this.setState({ signingIn: false })
  }

  logout = () => {
    localStorage.removeItem('token')
    const data = this.props.client.readQuery({ query: ROOT_QUERY })
    this.props.client.writeQuery({
      query: ROOT_QUERY,
      data: {
        ...data,
        me: null
      }
    })
  }

  componentDidMount() {
    if (window.location.search.match(/code=/)) {
      this.setState({ signingIn: true })
      const code = window.location.search.replace('?code=', '')
      this.githubAuthMutation({ variables: { code } })
    }
  }

  requestCode() {
    const clientId = process.env.REACT_APP_GITHUB_CLIENT_ID
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`
  }

  render() {
    return (
      <Mutation
        mutation={GITHUB_AUTH_MUTATION}
        update={this.authorizationComplete}
        refetchQueries={[{ query: ROOT_QUERY }]}
      >
        {(mutation) => {
          this.githubAuthMutation = mutation
          return (
            <Me
              logout={this.logout}
              requestCode={this.requestCode}
              signingIn={this.state.signingIn}
            />
          )
        }}
      </Mutation>
    )
  }
}

export default compose(withApollo, withRouter)(AuthorizedUser)
