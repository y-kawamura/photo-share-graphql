module.exports = {
  newPhoto: {
    subscribe: (parent, args, { pubsub }) => {
      console.log('subscribe photo-added')
      return pubsub.asyncIterator('photo-added')
    }
  },

  newUser: {
    subscribe: (parent, args, { pubsub }) => {
      console.log('subscribe uesr-added')
      return pubsub.asyncIterator('user-added')
    }
  }
}
