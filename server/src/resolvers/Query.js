const { users, photos } = require('../sampleData')

module.exports = {
  hello: () => 'world',
  totalPhotos: () => photos.length,
  allPhotos: () => photos,
  allUsers: () => users
}
