import React from 'react'
import PropTypes from 'prop-types'
import { Card } from 'rctui'
import queryString from 'query-string'
import List from './List'

function Book(props) {
  const { history } = props

  const query = queryString.parse(history.location.search)
  if (!query.size) query.size = 12

  return (
    <Card>
      <Card.Header>书籍管理</Card.Header>

      <List history={history} fetch={{ url: '/api/booklist', data: query }} />
    </Card>
  )
}

Book.propTypes = {
  history: PropTypes.object.isRequired,
}

export default Book
