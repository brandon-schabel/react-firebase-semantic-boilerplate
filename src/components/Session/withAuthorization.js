import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

const withAuthorization = condition => Component => props => {
  useEffect(() => {
    const listener = props.firebase.onAuthUserListener(
      authUser => {
        if (!condition(authUser)) props.history.push(ROUTES.SIGN_IN);
      },
      () => props.history.push(ROUTES.SIGN_IN),
    );
    return () => listener(); // Unmount Phase
  }, []);

  return (
    <AuthUserContext.Consumer>
      {authUser =>
        condition(authUser) ? <Component {...props} /> : null
      }
    </AuthUserContext.Consumer>
  );
};

const WithAuthorization = compose(
  withRouter,
  withFirebase,
)(WithAuthorization);

export default withAuthorization;
