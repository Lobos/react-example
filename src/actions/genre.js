import { Message } from 'rctui'
import refetch from 'refetch'

export const GENRE_LIST = 'GENRE_LIST'
function handleList(status, data, message) {
  return {
    type: GENRE_LIST,
    status,
    data,
    message,
  }
}

function fetchList() {
  return (dispatch) => {
    dispatch(handleList(0))
    refetch.get('/api/genres', { size: 999 }).then((res) => {
      if (res.data) {
        dispatch(handleList(1, res.data.list))
      } else {
        dispatch(handleList(2, null, res.error))
      }
    }).catch((err) => {
      dispatch(handleList(2, null, err.message))
    })
  }
}

export function getGenreList() {
  return (dispatch, getState) => {
    const { data, status } = getState().genre
    if (status === 1 && data && data.length > 0) {
      return Promise.resolve()
    }
    return dispatch(fetchList())
  }
}

export function saveGenre(body, onSuccess) {
  return (dispatch, getState) => {
    refetch.post('/api/genre', body, { dataType: 'json' }).then((res) => {
      if (res.data) {
        onSuccess()
        const data = getState().genre.data.filter(d => d.id !== res.data.id)
        data.unshift(res.data)
        dispatch(handleList(1, data))
        Message.success('保存成功')
      } else {
        Message.error(res.error)
      }
    }).catch((err) => {
      Message.error(err.message)
    })
  }
}

export function removeGenre(id) {
  return (dispatch, getState) => {
    refetch.delete('/api/genre', { id }).then((res) => {
      if (res.data === 1) {
        Message.success('删除成功')
        const data = getState().genre.data.filter(d => d.id !== id)
        dispatch(handleList(1, data))
      }
    }).catch((err) => {
      Message.error(err.message)
    })
  }
}
