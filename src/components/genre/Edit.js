import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Card, Form, FormControl, Button } from 'rctui'
import { saveGenre } from '_/actions/genre'

class Edit extends Component {
  constructor(props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleCancel = this.handleCancel.bind(this)
  }

  handleSubmit(data) {
    this.props.dispatch(saveGenre(data, this.props.history.goBack))
  }

  handleCancel() {
    this.props.history.goBack()
  }

  render() {
    const { data } = this.props

    return (
      <Card>
        <Card.Header>类型编辑</Card.Header>

        <div style={{ padding: 20 }}>
          <Form data={data} style={{ width: 700 }} onSubmit={this.handleSubmit} >
            <FormControl label="名称" name="name" grid={1 / 3} type="text" required min={2} max={20} />
            <FormControl label="简介" name="desc" type="textarea" max={200} />
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
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
}

Edit.defaultProps = {
  data: {},
}

export default connect()(Edit)

