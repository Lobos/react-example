import React, { Component } from 'react'
import PropTypes from 'prop-types'
import refetch from 'refetch'
import Loading from '_/components/comm/Loading'

const PENDING = 0
const SUCCESS = 1
const FAILURE = 2

export default function (Origin) {
  class Fetch extends Component {
    constructor(props) {
      super(props)
      this.state = {
        data: null,
        status: props.fetch ? PENDING : SUCCESS,
      }

      this.fetchData = this.fetchData.bind(this)
    }

    componentWillMount() {
      this.fetchData()
      this.isUnmounted = false
    }

    componentWillReceiveProps(nextProps) {
      // 这里可以对nextProps.fetch和this.props.fetch做一个deepEqual对比，如果不同才重新获取数据
      this.fetchData(nextProps)
    }

    componentWillUnmount() {
      this.isUnmounted = true
    }

    fetchData(props = this.props) {
      let { fetch } = props

      if (!fetch) return

      if (typeof fetch === 'string') fetch = { url: fetch }

      this.setState({ data: null, status: PENDING })
      refetch.get(fetch.url, fetch.data).then((res) => {
        if (this.isUnmounted) return
        if (res.data) {
          this.setState({ status: SUCCESS, data: res.data })
        } else {
          this.setState({ status: FAILURE, message: res.data === null ? '请求资源不存在' : res.error })
        }
      }).catch((e) => {
        if (this.isUnmounted) return
        this.setState({ status: FAILURE, message: e.message })
      })
    }

    render() {
      const { status, data } = this.state

      if (status === SUCCESS) {
        return <Origin {...this.props} data={data} fetchData={this.fetchData} />
      }

      if (status === PENDING && this.props.loading) {
        return <Loading />
      }

      if (status === FAILURE) {
        return <div>{this.state.message}</div>
      }
      return null
    }
  }

  Fetch.propTypes = {
    fetch: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    loading: PropTypes.bool,
  }
  Fetch.defaultProps = {
    fetch: null,
    loading: true,
  }

  return Fetch
}
