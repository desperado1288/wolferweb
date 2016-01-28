import React, { PropTypes } from 'react';
import {connect} from 'react-redux';
import { routeActions } from 'react-router-redux';

export function requireAuthentication(Component) {

  class AuthenticatedComponent extends React.Component {

    static propTypes = {
      token: PropTypes.string.isRequired,
      userName: PropTypes.string.isRequired,
      isAuthenticated: PropTypes.bool.isRequired,
      location: PropTypes.object.isRequired,
      dispatch: PropTypes.func.isRequired
    };

    constructor(props){
      super(props)
      this.checkAuth.bind(this)
    }

    componentWillMount () {
      this.checkAuth();
    }

    componentWillReceiveProps (nextProps) {
      this.checkAuth();
    }

    checkAuth () {
      if (!this.props.isAuthenticated) {
        let redirectAfterLogin = this.props.location.pathname;
        routeActions.push(`/login?next=${redirectAfterLogin}`);
      }
    }

    render () {
      return (
        <div>
          {this.props.isAuthenticated === true
            ? <Component {...this.props}/>
            : null
          }
        </div>
      )

    }
  }

  const mapStateToProps = (state) => ({
    token: state.auth.token,
    userName: state.auth.userName,
    isAuthenticated: state.auth.isAuthenticated
  });

  return connect(mapStateToProps)(AuthenticatedComponent);

}
