import React from 'react'
import PropTypes from 'prop-types'
import { Card, Button } from 'rctui'
import queryString from 'query-string'
import TableList from './TableList'

function List(props) {
  const { history } = props

  const query = queryString.parse(history.location.search)
  if (!query.size) query.size = 10

  return (
    <Card>
      <Card.Header>作者列表</Card.Header>
      <div style={{ padding: 12 }}>
        <Button status="success" onClick={() => history.push('/author/new')}>添加作者</Button>
      </div>

      <TableList
        history={history}
        fetch={{ url: '/api/authorlist', data: query }}
      />
    </Card>
  )
}

List.propTypes = {
  history: PropTypes.object.isRequired,
}

export default List
