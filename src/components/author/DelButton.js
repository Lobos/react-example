import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Modal, Message } from 'rctui'
import refetch from 'refetch'

class DelButton extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { data, onSuccess } = this.props
    const mid = Modal.open({
      header: 'Warning',
      content: `确定要删除 ${data.name} 吗？`,
      buttons: {
        确定: () => {
          refetch.delete('/api/author', { id: data.id }).then((res) => {
            if (res.data) {
              onSuccess()
              Message.success('删除成功')
            }
            Modal.close(mid)
          })
        },
        取消: true,
      },
    })
  }

  render() {
    return <a href="javascript:;" onClick={this.handleClick}>删除</a>
  }
}

DelButton.propTypes = {
  data: PropTypes.object.isRequired,
  onSuccess: PropTypes.func.isRequired,
}

DelButton.defaultProps = {
}

export default DelButton
