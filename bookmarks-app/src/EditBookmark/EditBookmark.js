import React, { Component } from 'react';
import PropTypes from 'prop-types';
import BookmarksContext from '../BookmarksContext';
import config from '../config'
import './BookmarkForm.css';

class EditBookmark extends Component {
  static propTypes = {
    match: PropTypes.shape({
      params: PropTypes.object,
    }),
    history: PropTypes.shape({
      push: PropTypes.func,
    }).isRequired,
  };

  static contextType = BookmarksContext;

  state = {
    error: null,
    id: '',
    title: '',
    url: '',
    description: '',
    rating: 1,
  };

  componentDidMount() {
    const { bookmarkId } = this.props.match.params
    fetch(`${config.API_ENDPOINT}/bookmarks/${bookmarkId}`, {
      method: 'GET',
      headers: {
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))

        return res.json()
      })
      .then(responseData => {
        this.setState({
          id: responseData.id,
          title: responseData.title,
          url: responseData.url,
          description: responseData.description,
          rating: responseData.rating,
        })
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  resetFields = (newFields) => {
    this.setState({
      id: newFields.id || '',
      title: newFields.title || '',
      url: newFields.url || '',
      description: newFields.description || '',
      rating: newFields.rating || '',
    })
  }

  handleSubmit = e => {
    e.preventDefault()
    this.setState({ error: null })
    const { bookmarkId } = this.props.match.params
    const { id, title, url, description, rating } = this.state
    const newBookmark = { id, title, url, description, rating }
    fetch(`${config.API_ENDPOINT}/bookmarks/${bookmarkId}`, {
      method: 'PATCH',
      body: JSON.stringify(newBookmark),
      headers: {
        'content-type': 'application/json',
        'authorization': `Bearer ${config.API_KEY}`
      }
    })
      .then(res => {
        if (!res.ok)
          return res.json().then(error => Promise.reject(error))
      })
      .then(() => {
        this.resetFields(newBookmark)
        this.context.updateBookmark(newBookmark)
        this.props.history.push('/')
      })
      .catch(error => {
        console.error(error)
        this.setState({ error })
      })
  }

  handleClickCancel = () => {
    this.props.history.push('/')
  };

  handleChangeTitle = e => {
    this.setState({ title: e.target.value })
  };

  handleChangeUrl = e => {
    this.setState({ url: e.target.value })
  };

  handleChangeDescription = e => {
    this.setState({ description: e.target.value })
  };

  handleChangeRating = e => {
    this.setState({ rating: e.target.value })
  };

  render() {
    const { error, title, url, description, rating } = this.state
    return (
      <section className='EditBookmark'>
        <h2>Edit a bookmark</h2>

        <form
          className='BookmarkForm__form'
          onSubmit={this.handleSubmit}
        >
          <div className='BookmarkForm__error' role='alert'>
            {error && <p>{error.message}</p>}
          </div>
          <div>
            <label htmlFor='title'>
              Title
            {' '}
            </label>
            <input
              type='text'
              name='title'
              id='title'
              required
              value={title}
              onChange={this.handleChangeTitle}
            />
          </div>
          <div>
            <label htmlFor='url'>
              URL
            {' '}
            </label>
            <input
              type='url'
              name='url'
              id='url'
              required
              value={url}
              onChange={this.handleChangeUrl}
            />
          </div>
          <div>
            <label htmlFor='description'>
              Description
          </label>
            <textarea
              name='description'
              id='description'
              value={description}
              onChange={this.handleChangeDescription}
            />
          </div>
          <div>
            <label htmlFor='rating'>
              Rating
            {' '}
            </label>
            <input
              type='number'
              name='rating'
              id='rating'
              min='1'
              max='5'
              required
              value={rating}
              onChange={this.handleChangeRating}
            />
          </div>
          <div className='BookmarkForm__buttons'>
            <button type='button' onClick={this.handleClickCancel}>
              Cancel
          </button>
            {' '}
            <button type='submit'>
              Save
          </button>
          </div>
        </form>

      </section>
    );
  }
}

export default EditBookmark;
