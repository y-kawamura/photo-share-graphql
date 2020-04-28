const fetch = require('node-fetch')

const requestGitHubToken = (credential) =>
  fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify(credential)
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err)
    })

const requestGitHubAccount = (token) =>
  fetch('https://api.github.com/user', {
    headers: {
      Authorization: `token ${token}`
    }
  })
    .then((res) => res.json())
    .catch((err) => {
      throw new Error(err)
    })

const authorizeWithGitHub = async (credential) => {
  const { access_token } = await requestGitHubToken(credential)
  const githubUser = await requestGitHubAccount(access_token)

  return {
    ...githubUser,
    access_token
  }
}

module.exports = {
  authorizeWithGitHub
}
