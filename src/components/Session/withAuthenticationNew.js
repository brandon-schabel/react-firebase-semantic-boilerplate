import React, { useEffect, useState } from 'react';

import AuthUserContext from './context';
import { withFirebase } from '../Firebase';

const withAuthentication = Component => props => {
  const [authUser, setAuthUser] = useState(
    JSON.parse(localStorage.getItem('authUser')),
  );
  useEffect(() => {
    const listener = props.firebase.onAuthUserListener(
      authUser => {
        localStorage.setItem('authUser', JSON.stringify(authUser));
        setAuthUser(authUser);
      },
      () => {
        localStorage.removeItem('authUser');
        setAuthUser(null);
      },
    );
    return () => listener(); // Unmount Phase
  }, []);

  return (
    <AuthUserContext.Provider value={authUser}>
      <Component {...props} />
    </AuthUserContext.Provider>
  );
};

export default withFirebase(withAuthentication);
