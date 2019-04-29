import React, { useState } from 'react';
import { withRouter } from 'react-router-dom';
import { compose } from 'recompose';

import { SignUpLink } from '../SignUp';
import { PasswordForgetLink } from '../PasswordForget';
import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import {
  Grid,
  Form,
  Button,
  Header,
  Icon,
  Message,
  Divider,
} from 'semantic-ui-react';

const SignInPage = () => (
  <Grid centered columns={2}>
    <Grid.Column>
      <Header as="h2" textAlign="center">
        Sign In
      </Header>
      <SignInForm />
      <SignInGoogle />
      <SignInFacebook />
      <SignInTwitter />
      <SignUpLink />
    </Grid.Column>
  </Grid>
);

const ERROR_CODE_ACCOUNT_EXISTS =
  'auth/account-exists-with-different-credential';

const ERROR_MSG_ACCOUNT_EXISTS = `
  An account with an E-Mail address to
  this social account already exists. Try to login from
  this account instead and associate your social accounts on
  your personal account page.
`;

const SignInFormBase = ({ firebase, history }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const isInvalid = password === '' || email === '';

  const onSubmit = event => {
    firebase
      .doSignInWithEmailAndPassword(email, password)
      .then(() => {
        setEmail('');
        setPassword('');
        history.push(ROUTES.HOME);
      })
      .catch(error => setError(error));
    event.preventDefault();
  };

  const emailInput = e => setEmail(e.target.value);
  const passInput = e => setPassword(e.target.value);

  return (
    <div>
      {error && (
        <Message negative>
          <p>{error.message}</p>
        </Message>
      )}
      <Form onSubmit={onSubmit}>
        <Form.Field>
          <label>Email</label>
          <input
            name="email"
            value={email}
            onChange={emailInput}
            type="text"
            placeholder="Email Address"
          />
        </Form.Field>
        <Form.Field>
          <label>Password</label>
          <input
            name="password"
            value={password}
            onChange={passInput}
            type="password"
            placeholder="Password"
          />
        </Form.Field>
        <Button primary disabled={isInvalid} type="submit">
          Submit
        </Button>
        <PasswordForgetLink />
        <Divider horizontal>Or sign in with</Divider>
      </Form>
    </div>
  );
};

const SignInGoogleBase = ({ firebase, history }) => {
  const [error, setError] = useState(null);

  const onSubmit = event => {
    firebase
      .doSignInWithGoogle()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.user.displayName,
            email: socialAuthUser.user.email,
            roles: {},
          },
          { merge: true },
        );
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        setError(error);
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} className="inline">
      <Button color="google plus" type="submit">
        <Icon name="google" /> Google
      </Button>

      {error && (
        <Message negative>
          <p>{error.message}</p>
        </Message>
      )}
    </form>
  );
};

const SignInFacebookBase = ({ firebase, history }) => {
  const [error, setError] = useState(null);

  const onSubmit = event => {
    firebase
      .doSignInWithFacebook()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            roles: {},
          },
          { merge: true },
        );
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        setError(error);
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} className="inline">
      <Button color="facebook" type="submit">
        <Icon name="facebook" /> Facebook
      </Button>

      {error && (
        <Message negative>
          <p>{error.message}</p>
        </Message>
      )}
    </form>
  );
};

const SignInTwitterBase = ({ firebase, history }) => {
  const [error, setError] = useState(null);

  const onSubmit = event => {
    firebase
      .doSignInWithTwitter()
      .then(socialAuthUser => {
        // Create a user in your Firebase Realtime Database too
        return firebase.user(socialAuthUser.user.uid).set(
          {
            username: socialAuthUser.additionalUserInfo.profile.name,
            email: socialAuthUser.additionalUserInfo.profile.email,
            roles: {},
          },
          { merge: true },
        );
      })
      .then(() => {
        setError(null);
        history.push(ROUTES.HOME);
      })
      .catch(error => {
        if (error.code === ERROR_CODE_ACCOUNT_EXISTS) {
          error.message = ERROR_MSG_ACCOUNT_EXISTS;
        }

        setError(error);
      });

    event.preventDefault();
  };

  return (
    <form onSubmit={onSubmit} className="inline">
      <Button color="twitter" type="submit">
        <Icon name="twitter" /> Twitter
      </Button>

      {error && (
        <Message negative>
          <p>{error.message}</p>
        </Message>
      )}
    </form>
  );
};

const SignInForm = compose(
  withRouter,
  withFirebase,
)(SignInFormBase);

const SignInGoogle = compose(
  withRouter,
  withFirebase,
)(SignInGoogleBase);

const SignInFacebook = compose(
  withRouter,
  withFirebase,
)(SignInFacebookBase);

const SignInTwitter = compose(
  withRouter,
  withFirebase,
)(SignInTwitterBase);

export default SignInPage;

export { SignInForm, SignInGoogle, SignInFacebook, SignInTwitter };
