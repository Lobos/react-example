import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { Modal } from 'rctui'
import { removeGenre } from '_/actions/genre'

class DelButton extends Component {
  constructor(props) {
    super(props)
    this.handleClick = this.handleClick.bind(this)
  }

  handleClick() {
    const { data, dispatch } = this.props
    const mid = Modal.open({
      header: 'Warning',
      content: `确定要删除 ${data.name} 吗？`,
      buttons: {
        确定: () => {
          dispatch(removeGenre(data.id))
          Modal.close(mid)
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
  dispatch: PropTypes.func.isRequired,
}

export default connect()(DelButton)
