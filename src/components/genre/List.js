import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Card, Table, Button } from 'rctui'
import DelButton from './DelButton'

function List(props) {
  const { data, history } = props
  return (
    <Card>
      <Card.Header>类型列表</Card.Header>

      <div style={{ padding: 12 }}>
        <Button status="success" onClick={() => history.push('/genre/new')}>添加类型</Button>
      </div>

      <Table
        data={data}
        columns={[
          {
            name: 'id',
            width: 100,
            header: 'ID',
            sort: [
              (a, b) => parseInt(a.id, 10) > parseInt(b.id, 10) ? 1 : -1,
              (a, b) => parseInt(a.id, 10) < parseInt(b.id, 10) ? 1 : -1,
            ],
          },
          { name: 'name', width: 160, header: '名称', sort: true },
          { name: 'desc', header: '简介' },
          {
            width: '120px',
            content: d => (
              <span>
                <Link to={`/genre/edit/${d.id}`}>编辑</Link>
                {' '}
                <DelButton data={d} />
              </span>
            ),
          },
        ]}
        pagination={{ size: 10, position: 'center' }}
      />
    </Card>
  )
}

List.propTypes = {
  data: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
}

export default List
