import React from 'react'
import PropTypes from 'prop-types'
import { Route, Switch } from 'react-router-dom'
import List from './List'
import Edit from './Edit'

function Author(props) {
  const { url } = props.match

  return (
    <Switch>
      <Route path={`${url}/new`} component={Edit} />
      <Route
        path={`${url}/edit/:id`}
        render={
          ({ history, match }) => <Edit history={history} fetch={{ url: `/api/author/${match.params.id}` }} />
        }
      />
      <Route path={`${url}`} component={List} />
    </Switch>
  )
}

Author.propTypes = {
  match: PropTypes.object.isRequired,
}

export default Author
