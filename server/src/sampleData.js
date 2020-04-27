const users = [
  {
    githubLogin: 'penta',
    name: 'penta'
  },
  {
    githubLogin: 'pii',
    name: 'pii'
  },
  {
    githubLogin: 'oyabin',
    name: 'oyabin'
  }
]

const photos = [
  {
    id: '1',
    name: "penta's photo",
    description: 'Today penguins',
    category: 'ACTION',
    githubUser: 'penta',
    created: '3-28-1977'
  },
  {
    id: '2',
    name: "pii's photo",
    description: 'Today penguins',
    category: 'SELFIE',
    githubUser: 'pii',
    created: '2020-04-15T19:09:57.500Z'
  },
  {
    id: '3',
    name: "oyabin's photo",
    description: 'Today penguins',
    category: 'LANDSCAPE',
    githubUser: 'oyabin',
    created: '5-28-2000'
  }
]

const tags = [
  {
    photoId: '1',
    userId: 'penta'
  },
  {
    photoId: '2',
    userId: 'penta'
  },
  {
    photoId: '2',
    userId: 'pii'
  },
  {
    photoId: '2',
    userId: 'oyabin'
  }
]

module.exports = {
  users,
  photos,
  tags
}
