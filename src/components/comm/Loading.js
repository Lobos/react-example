import React from 'react'
import PropTypes from 'prop-types'
import { Mask, Spin } from 'rctui'

function Loading(props) {
  const { color, height } = props

  return (
    <div style={{ position: 'relative', height }}>
      <Mask active>
        <Spin size={40} color={color} type="simple-circle" />
      </Mask>
    </div>
  )
}

Loading.propTypes = {
  color: PropTypes.string,
  height: PropTypes.number,
}

Loading.defaultProps = {
  color: '#1f8dd6',
  height: 200,
}

export default Loading
