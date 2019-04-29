import React, { useState } from 'react';

import { withFirebase } from '../Firebase';

import { Form, Message, Button } from 'semantic-ui-react';

const PasswordChangeForm = ({ firebase }) => {
  const [passOne, setPassOne] = useState('');
  const [passTwo, setPassTwo] = useState('');
  const [error, setError] = useState('');

  const onSubmit = event => {
    firebase
      .doPasswordUpdate(passOne)
      .then(() => {
        setPassOne('');
        setPassTwo('');
        setError(null);
      })
      .catch(error => {
        setError(error);
      });

    event.preventDefault();
  };

  const isInvalid = passOne !== passTwo || passOne === '';

  return (
    <Form onSubmit={onSubmit}>
      {error && (
        <Message negative>
          <p>{error.message}</p>
        </Message>
      )}
      <Form.Group widths="equal">
        <Form.Field>
          <label>Old Password</label>
          <input
            name="passwordOne"
            value={passOne}
            onChange={(e) => setPassOne(e.target.value) }
            type="password"
            placeholder="New Password"
          />
        </Form.Field>
        <Form.Field>
          <label>New Password</label>
          <input
            name="passTwo"
            value={passTwo}
            onChange={(e) => setPassTwo(e.target.value)}
            type="password"
            placeholder="Confirm New Password"
          />
        </Form.Field>
      </Form.Group>
      <Button primary disabled={isInvalid} type="submit">
        Reset My Password
      </Button>
    </Form>
  );
};

export default withFirebase(PasswordChangeForm);
