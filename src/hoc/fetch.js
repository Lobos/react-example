import React, { Component } from 'react'
import PropTypes from 'prop-types'
import refetch from 'refetch'
import { Mask, Spin } from 'rctui'

const PENDING = 0
const SUCCESS = 1
const FAILURE = 2

export default function (Origin) {
  class Fetch extends Component {
    constructor(props) {
      super(props)
      this.state = {
        data: null,
        status: PENDING,
      }

      this.fetchData = this.fetchData.bind(this)
    }

    componentWillMount() {
      if (this.props.fetch) this.fetchData()
      this.isMount = true
    }

    componentWillUnmount() {
      this.isMount = false
    }

    fetchData() {
      let { fetch } = this.props
      if (typeof fetch === 'string') fetch = { url: fetch }

      this.setState({ data: null, status: PENDING })
      refetch.get(fetch.url, fetch.data).then((res) => {
        if (!this.isMount) return
        if (res.data) {
          this.setState({ status: SUCCESS, data: res.data })
        } else {
          this.setState({ status: FAILURE, message: res.errors[0] })
        }
      }).catch((e) => {
        if (!this.isMount) return
        this.setState({ status: FAILURE, message: e.message })
      })
    }

    render() {
      const { status, data } = this.state

      if (status === SUCCESS) {
        return <Origin {...this.props} data={data} fetchData={this.fetchData} />
      }

      if (status === PENDING && this.props.loading) {
        return (
          <div style={{ position: 'relative' }}>
            <Mask >
              <Spin size={40} type="simple-circle" />
            </Mask>
          </div>
        )
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
