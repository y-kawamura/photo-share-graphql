import React, { Component, Fragment } from 'react'
import { gql } from 'apollo-boost'
import { Mutation } from 'react-apollo'
import { ROOT_QUERY } from '../App'

const POST_PHOTO_MUTATION = gql`
  mutation postPhoto($input: PostPhotoInput!) {
    postPhoto(input: $input) {
      id
      name
      url
    }
  }
`

const PhotoCategorys = ['SELFIE', 'PORTRAIT', 'ACTION', 'LANDSCAPE', 'GRAPHIC']

const updatePhotos = (cache, { data: { postPhoto } }) => {
  const data = cache.readQuery({ query: ROOT_QUERY })
  cache.writeQuery({
    query: ROOT_QUERY,
    data: {
      ...data,
      totalPhotos: data.totalPhotos + 1,
      allPhotos: {
        postPhoto,
        ...data.allPhotos
      }
    }
  })
}

class PostPhoto extends Component {
  state = {
    name: '',
    description: '',
    category: 'PORTRAIT',
    file: ''
  }

  postPhoto = async (mutation) => {
    await mutation({
      variables: {
        input: this.state
      }
    }).catch(console.error)

    this.props.history.replace('/')
  }

  render() {
    return (
      <Fragment>
        <h1>Post a Photo</h1>
        <form onSubmit={(e) => e.preventDefault()}>
          {/* name */}
          <div className='form-control'>
            <label htmlFor='name'>Photo Name</label>
            <input
              type='text'
              id='name'
              value={this.state.name}
              onChange={({ target }) => this.setState({ name: target.value })}
            />
          </div>
          {/* description */}
          <div className='form-control'>
            <label htmlFor='description'>Description</label>
            <textarea
              id='description'
              rows='4'
              value={this.state.description}
              onChange={({ target }) =>
                this.setState({ description: target.value })
              }
            ></textarea>
          </div>
          {/* category */}
          <div className='form-control'>
            <select
              id='category'
              value={this.state.category}
              onChange={({ target }) =>
                this.setState({ category: target.value })
              }
            >
              {PhotoCategorys.map((photoCategory) => (
                <option value={photoCategory} key={photoCategory}>
                  {photoCategory}
                </option>
              ))}
            </select>
          </div>
          {/* file */}
          <div className='form-control'>
            <input
              type='file'
              accept='image/jpeg'
              onChange={({ target }) =>
                this.setState({
                  file:
                    target.files && target.files.length ? target.files[0] : ''
                })
              }
            />
          </div>

          <div>
            <Mutation mutation={POST_PHOTO_MUTATION} update={updatePhotos}>
              {(mutation) => (
                <button onClick={() => this.postPhoto(mutation)}>
                  Post Photo
                </button>
              )}
            </Mutation>
            <button onClick={() => this.props.history.goBack()}>Cancel</button>
          </div>
        </form>
      </Fragment>
    )
  }
}

export default PostPhoto
