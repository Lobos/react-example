import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'
import { Table, Pagination } from 'rctui'
import fetch from '_/hoc/fetch'
import DelButton from './DelButton'

function TableList(props) {
  const { data, history, fetchData } = props
  return (
    <div>
      <Table
        data={data.list}
        columns={[
          { name: 'id', width: '60px', header: 'ID' },
          { name: 'name', header: '姓名' },
          { name: 'nationality', header: '国籍' },
          { name: 'birthday', header: '生日' },
          {
            width: '120px',
            content: d => (
              <span>
                <Link to={`/author/edit/${d.id}`}>编辑</Link>
                {' '}
                <DelButton onSuccess={fetchData} data={d} />
              </span>
            ),
          },
        ]}
      />
      <div style={{ textAlign: 'center' }}>
        <Pagination
          page={data.page} size={data.size} total={data.total}
          onChange={page => history.push(`/author?page=${page}`)}
        />
      </div>
    </div>
  )
}

TableList.propTypes = {
  data: PropTypes.object.isRequired,
  fetchData: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

export default fetch(TableList)
