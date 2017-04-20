import React from 'react'
import PropTypes from 'prop-types'
import { Table, Card } from 'rctui'
import fetch from '_/hoc/fetch'

function List(props) {
  const { data } = props
  return (
    <Card>
      <Card.Header>作者列表</Card.Header>
      <Table
        data={data.list}
        columns={[
          { name: 'id', header: 'ID' },
          { name: 'name', header: '姓名', sort: true },
          { name: 'nationality', header: '国籍' },
          { name: 'birthday', header: '生日', sort: true },
        ]}
      />
    </Card>
  )
}

List.propTypes = {
  data: PropTypes.object.isRequired,
}

export default fetch(List)
