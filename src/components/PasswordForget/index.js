import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { withFirebase } from '../Firebase';
import * as ROUTES from '../../constants/routes';

import { Form, Button, Message } from 'semantic-ui-react';

const PasswordForgetPage = () => (
  <div>
    <h1>PasswordForget</h1>
    <PasswordForgetForm />
  </div>
);

const PasswordForgetFormBase = ({ firebase }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(null);

  const isInvalid = email === '';

  const onSubmit = event => {
    firebase
      .doPasswordReset(email)
      .then(() => {
        setEmail('');
        setError(null);
      })
      .catch(error => setError(error));
    event.preventDefault();
  };

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
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Email Address"
          />
        </Form.Field>
        <Button primary disabled={isInvalid} type="submit">
          Reset My Password
        </Button>
      </Form>
    </div>
  );
};

const PasswordForgetLink = () => (
  <p>
    <Link to={ROUTES.PASSWORD_FORGET}>Forgot Password?</Link>
  </p>
);

export default PasswordForgetPage;
const PasswordForgetForm = withFirebase(PasswordForgetFormBase);
export { PasswordForgetForm, PasswordForgetLink };
