import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Media, Image, Button, Modal, Pagination } from 'rctui'
import { getGenreList } from '_/actions/genre'
import fetch from '_/hoc/fetch'
import Edit from './Edit'

class List extends Component {
  componentDidMount() {
    this.props.dispatch(getGenreList())
  }

  handleEdit(book) {
    const { genres } = this.props

    const fc = book ? { url: `/api/book/${book.id}` } : undefined

    const mid = Modal.open({
      header: '书籍编辑',
      width: 800,
      content: (
        <Edit
          genres={genres}
          fetch={fc}
          onSuccess={() => {
            this.props.fetchData()
            Modal.close(mid)
          }}
        />
      ),
      buttons: {
        提交: 'submit',
        取消: true,
      },
    })
  }

  render() {
    const { data, history } = this.props
    return (
      <div>
        <div style={{ padding: 20 }}>
          <Button status="success" onClick={() => this.handleEdit(null)}>添加书籍</Button>
        </div>

        {data.list.map(d => (
          <div
            key={d.id}
            style={{
              width: 350,
              display: 'inline-block',
              position: 'relative',
              border: 'solid 1px #eee',
              padding: 12,
              margin: '0 0 20px 20px',
            }}
          >
            <Media>
              <Media.Left>
                <Image src={d.cover} width={100} height={150} type="fill" />
              </Media.Left>
              <Media.Body style={{ fontSize: 12, paddingLeft: 10, color: '#666' }}>
                <h4 style={{ fontSize: 18, marginBottom: 16 }}>{d.title}</h4>
                <div>作者：{d.author}</div>
                <div>出版时间：{d.publishAt}</div>
                <div>类型：{d.genres}</div>
                <Button
                  style={{ position: 'absolute', right: 0, bottom: 0, fontSize: 12 }}
                  status="link"
                  onClick={() => this.handleEdit(d)}
                >编辑</Button>
              </Media.Body>
            </Media>
          </div>
        ))}

        <div style={{ textAlign: 'center' }}>
          <Pagination
            page={data.page} size={data.size} total={data.total}
            onChange={page => history.push(`/book?page=${page}`)}
          />
        </div>
      </div>
    )
  }
}

List.propTypes = {
  data: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  genres: PropTypes.array,
  history: PropTypes.object.isRequired,
}

List.defaultProps = {
  genres: [],
}

const mapStateToProps = (state) => {
  const { genre } = state
  return { genres: genre.data }
}

export default fetch(connect(mapStateToProps)(List))

