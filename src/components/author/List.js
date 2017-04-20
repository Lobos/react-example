import React, { Component } from 'react'
import { Table, Card } from 'rctui'
import fetch from 'refetch'

class List extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: {
        list: [],
      },
    }
  }

  componentWillMount() {
    fetch.get('/authorlist.json').then((res) => {
      this.setState({ data: res.data })
    })
  }

  render() {
    return (
      <Card>
        <Card.Header>作者列表</Card.Header>
        <Table
          data={this.state.data.list}
          columns={[
            { name: 'id', header: 'ID' },
            { name: 'name', header: '姓名' },
            { name: 'nationality', header: '国籍' },
            { name: 'birthday', header: '生日' },
          ]}
        />
      </Card>
    )
  }
}

export default List
