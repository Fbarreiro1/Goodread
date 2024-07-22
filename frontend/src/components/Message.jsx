import React from 'react';
import { Alert } from 'react-bootstrap';

const Message = ({ variant, children, style }) => {
  return (
    <Alert variant={variant} style={style}>
      {children}
    </Alert>
  );
};

Message.defaultProps = {
  variant: 'info',
};

export default Message;
