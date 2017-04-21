import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Card, Form, FormControl, Message, Button } from 'rctui'
import refetch from 'refetch'
import fetch from '_/hoc/fetch'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleSubmit(data) {
    refetch.post('/api/author', data).then((res) => {
      if (res.data) {
        this.props.history.push('/author')
        Message.success('保存成功')
      } else {
        Message.error(res.error)
      }
    })
  }

  handleCancel() {
    this.props.history.goBack()
  }

  render() {
    const { data } = this.props

    return (
      <Card>
        <Card.Header>作者编辑</Card.Header>

        <div style={{ padding: 20 }}>
          <Form data={data} onSubmit={this.handleSubmit} >
            <FormControl label="姓名" name="name" grid={1 / 3} type="text" required min={2} max={20} />
            <FormControl label="生日" name="birthday" type="date" required />
            <FormControl label="国籍" name="nationality" type="text" />
            <FormControl>
              <Button type="submit" status="primary">提交</Button>
              <Button onClick={this.handleCancel}>取消</Button>
            </FormControl>
          </Form>
        </div>
      </Card>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object,
  history: PropTypes.object.isRequired,
}

Edit.defaultProps = {
  data: {},
}

export default fetch(Edit)
