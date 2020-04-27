module.exports = {
  async postPhoto(parent, args, { db }) {
    const newPhoto = {
      ...args.input,
      created: new Date()
    }

    const { insertedId } = await db.collection('photos').insertOne(newPhoto)

    newPhoto.id = insertedId

    return newPhoto
  }
}
