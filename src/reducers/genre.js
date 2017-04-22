import { GENRE_LIST } from '_/actions/genre'

export default function (state = {
  status: 0,
  data: undefined,
}, action) {
  switch (action.type) {
    case GENRE_LIST:
      return Object.assign({}, state, {
        status: action.status,
        data: action.data,
        message: action.message,
      })
    default:
      return state
  }
}
