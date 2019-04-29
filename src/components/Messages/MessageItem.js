import React, { useState } from 'react';
import { distanceInWordsToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import { Feed, Icon, Form, Button } from 'semantic-ui-react';

export const TimeAgo = ({ time }) => (
  <time>{distanceInWordsToNow(time)} ago</time>
);

export const MessageItem = ({
  message,
  onEditMessage,
  authUser,
  onRemoveMessage,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(message.text);

  const onToggleEditMode = () => {
    setEditMode(!editMode);
    setEditText(message.text);
  };

  const onChangeEditText = event => setEditText(event.target.value);

  const onSaveEditText = () => {
    onEditMessage(message, editText);
    setEditMode(false);
  };

  const CallBindMethod = (value) => {
    console.log(value)
  }

  return (
    <Feed.Event>
      <Feed.Content>
        <Feed.Summary>
          <Feed.User as={Link} to={`/`}>
            {message.userId}
          </Feed.User>
          <Feed.Date>
            <TimeAgo time={message.createdAt} />
          </Feed.Date>
        </Feed.Summary>
        <Feed.Extra>
          {editMode ? (
            <Form>
              <Form.Field>
                <input
                  type="text"
                  value={editText}
                  onChange={onChangeEditText}
                />
              </Form.Field>
            </Form>
          ) : (
            <span>
              {message.text}{' '}
              {message.editedAt && <span>(Edited)</span>}
            </span>
          )}
        </Feed.Extra>
        <Feed.Meta>
          {authUser.uid === message.userId && (
            <span>
              {editMode ? (
                <span>
                  <Button icon onClick={onSaveEditText}>
                    <Icon color="green" name="save outline" />
                  </Button>
                  <Button icon onClick={onToggleEditMode}>
                    <Icon color="blue" name="undo alternate" />
                  </Button>
                </span>
              ) : (
                <span>
                  <Button icon onClick={onToggleEditMode}>
                    <Icon color="blue" name="edit outline" />
                  </Button>
                  <Button
                    icon
                    onClick={() => onRemoveMessage(message.uid)}
                  >
                    <Icon color="red" name="trash alternate" />
                  </Button>
                </span>
              )}
            </span>
          )}
        </Feed.Meta>
      </Feed.Content>
    </Feed.Event>
  );
};
