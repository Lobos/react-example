import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, FormControl, Message } from 'rctui'
import fetch from '_/hoc/fetch'
import refetch from 'refetch'

class Edit extends Component {
  constructor(props) {
    super(props)

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(data) {
    refetch.post('/api/book', data).then((res) => {
      if (res.data) {
        this.props.onSuccess()
        Message.success('保存成功')
      } else {
        Message.error(res.error)
      }
    })
  }

  render() {
    const { data, genres } = this.props

    return (
      <Form data={data} onSubmit={this.handleSubmit}>
        <FormControl label="书名" name="title" grid={1 / 2} type="text" required min={2} max={20} />

        <FormControl
          label="作者" name="author" type="select" required grid={1 / 3}
          fetch={{ url: '/api/authorlist?size=999', then: res => res.data.list }}
          valueTpl="{id}" optionTpl="{name}"
        />

        <FormControl label="出版时间" type="text" name="publishAt" grid={1 / 2} />

        <FormControl label="封面图片" type="text" name="cover" grid={7 / 8} />

        <FormControl
          label="类别" type="checkbox-group" name="genres"
          data={genres} valueTpl="{id}" textTpl="{name}"
        />

        <FormControl label="简介" type="textarea" rows={3} name="desc" grid={7 / 8} />
      </Form>
    )
  }
}

Edit.propTypes = {
  data: PropTypes.object,
  genres: PropTypes.array.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

Edit.defaultProps = {
  data: {},
}

export default fetch(Edit)
