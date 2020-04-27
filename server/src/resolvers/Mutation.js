const { photos } = require('../sampleData')
let _id = 0

module.exports = {
  postPhoto(parent, args) {
    const newPhoto = {
      id: _id++,
      ...args.input,
      created: new Date()
    }
    photos.push(newPhoto)
    return newPhoto
  }
}
