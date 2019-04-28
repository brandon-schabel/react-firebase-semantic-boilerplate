import React, { Component } from 'react';

import { withFirebase } from '../Firebase';

import { Card, Loader, Button } from 'semantic-ui-react';

class UserItem extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      user: null,
      ...props.location.state,
    };
  }

  componentDidMount() {
    if (this.state.user) {
      return;
    }

    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .user(this.props.match.params.id)
      .onSnapshot(snapshot => {
        this.setState({
          user: snapshot.data(),
          loading: false,
        });
      });
  }

  componentWillUnmount() {
    this.unsubscribe && this.unsubscribe();
  }

  onSendPasswordResetEmail = () => {
    this.props.firebase.doPasswordReset(this.state.user.email);
  };

  render() {
    const { user, loading } = this.state;

    return (
      <Card fluid={true}>
        {loading ? (
          <Loader active inline="centered" />
        ) : (
          <Card.Content>
            <Card.Header>User: {user.uid}</Card.Header>
            <Card.Description>
              {user && (
                <div>
                  <Card.Content>
                    <Card.Meta>
                      <span>Username: {user.username}</span>
                    </Card.Meta>
                    <Card.Description>{user.email}</Card.Description>
                    <br />
                    <Button
                      primary
                      type="button"
                      onClick={this.onSendPasswordResetEmail}
                    >
                      Send Password Reset
                    </Button>
                  </Card.Content>
                </div>
              )}
            </Card.Description>
          </Card.Content>
        )}
      </Card>
    );
  }
}

export default withFirebase(UserItem);
