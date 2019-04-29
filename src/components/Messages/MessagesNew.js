import React, { useEffect, useState } from 'react';

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

const Messages = ({ firebase }) => {
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [messages, setMessages] = useState([]);
  const [limit, setLimit] = useState(5);

  useEffect(() => {
    onListenForMessages();
    return () => {
      unsubscribe();
    };
  }, []);

  const onListenForMessages = () => {
    setLoading(true);

    const unsubscribe = 
  };

  const unSubscribe = () => {
    firebase
      .messages()
      .orderBy('createdAt', 'desc')
      .limit(limit)
      .onSnapshot(snapshot => {
        if (snapshot.size) {
          let newMessages = [];
          snapshot.forEach(doc =>
            newMessages.push({ ...doc.data(), uid: doc.id }),
          );
          setMessages(newMessages.reverse());
          setLoading(false);
        } else {
          setMessages(null);
          setLoading(false);
        }
      });
  }

  const onChangeText = event => setText(event.target.value);
  const onCreateMessage = (event, authUser) => {
    firebase.messages().add({
      text,
      userId: authUser.uid,
      createdAt: firebase.fieldValue.serverTimestamp(),
    });

    setText('');
    event.preventDefault();
  };

  const onEditMessage = (message, text) => {
    const { uid, ...messageSnapshot } = message;

    firebase.message(message.uid).update({
      ...messageSnapshot,
      text,
      editedAt: firebase.fieldVlaue.serverTimestamp(),
    });
  };

  const onRemoveMessage = uid => firebase.message(uid).delete();

  const onNextPage = () => {
    setLimit(limit + 5);
    onListenForMessages();
  };

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
                  onClick={onNextPage}
                >
                  Load Older Messages
                </Button>
              )}

              {messages && (
                <MessageList
                  authUser={authUser}
                  messages={messages}
                  onEditMessage={onEditMessage}
                  onRemoveMessage={onRemoveMessage}
                />
              )}

              {!loading && !messages && (
                <Message info>
                  <p>There are no messages ...</p>
                </Message>
              )}

              {!loading && (
                <Form onSubmit={onCreateMessage.bind(this, authUser)}>
                  <Form.TextArea
                    value={text}
                    onChange={onChangeText}
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
};

export default withFirebase(Messages);
