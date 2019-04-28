import React, { Component } from 'react';

import { AuthUserContext } from '../Session';
import { withFirebase } from '../Firebase';
import MessageList from './MessageList';

import {
  Card,
  Message,
  Button,
  Loader,
  Form,
  Icon,
} from 'semantic-ui-react';

class Messages extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      loading: false,
      messages: [],
      limit: 5,
    };
  }

  componentDidMount() {
    this.onListenForMessages();
  }

  onListenForMessages = () => {
    this.setState({ loading: true });

    this.unsubscribe = this.props.firebase
      .messages()
      .orderBy('createdAt', 'desc')
      .limit(this.state.limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let messages = [];
          snapshot.forEach(doc =>
            messages.push({ ...doc.data(), uid: doc.id }),
          );

          this.setState({
            messages: messages.reverse(),
            loading: false,
          });
        } else {
          this.setState({ messages: null, loading: false });
        }
      });
  };

  componentWillUnmount() {
    this.unsubscribe();
  }

  onChangeText = event => {
    this.setState({ text: event.target.value });
  };

  onCreateMessage = (event, authUser) => {
    this.props.firebase.messages().add({
      text: this.state.text,
      userId: authUser.uid,
      createdAt: this.props.firebase.fieldValue.serverTimestamp(),
    });

    this.setState({ text: '' });

    event.preventDefault();
  };

  onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    this.props.firebase.message(message.uid).update({
      ...messageSnapshot,
      text,
      editedAt: this.props.firebase.fieldValue.serverTimestamp(),
    });
  };

  onRemoveMessage = uid => {
    this.props.firebase.message(uid).delete();
  };

  onNextPage = () => {
    this.setState(
      state => ({ limit: state.limit + 5 }),
      this.onListenForMessages,
    );
  };

  render() {
    const { text, messages, loading } = this.state;

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <Card fluid={true}>
            <Card.Content>
              <Card.Description>
                {loading && <Loader active inline="centered" />}

                {!loading && messages && (
                  <Button
                    size="small"
                    positive
                    type="button"
                    onClick={this.onNextPage}
                  >
                    Load Older Messages
                  </Button>
                )}

                {messages && (
                  <MessageList
                    authUser={authUser}
                    messages={messages}
                    onEditMessage={this.onEditMessage}
                    onRemoveMessage={this.onRemoveMessage}
                  />
                )}

                {!loading && !messages && (
                  <Message info>
                    <p>There are no messages ...</p>
                  </Message>
                )}

                {!loading && (
                  <Form
                    onSubmit={event =>
                      this.onCreateMessage(event, authUser)
                    }
                  >
                    <Form.TextArea
                      value={text}
                      onChange={this.onChangeText}
                      placeholder="Enter your message here..."
                    />
                    <Button primary type="submit">
                      Send <Icon name="send" />
                    </Button>
                  </Form>
                )}
              </Card.Description>
            </Card.Content>
          </Card>
        )}
      </AuthUserContext.Consumer>
    );
  }
}

export default withFirebase(Messages);
