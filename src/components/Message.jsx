import React, { useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../cotext/AuthContext';
import { ChatContext } from '../cotext/ChatContext';

const Message = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef();

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  return (
    <div ref={ref} className={`message ${message.senderId === currentUser.uid && "owner"}`}>
      <div className="messageInfo">
        <img
          src={message.senderId === currentUser.uid ? currentUser.photoURL : data.user.photoURL}
          alt="" />
        <span>{`${message.date.toDate().getHours()}:${(message.date.toDate().getMinutes() > 9 ? message.date.toDate().getMinutes()
          : `0${message.date.toDate().getMinutes()}`)}`}</span>
      </div>
      <div className="messageContent">
        {!message.img &&<p>{message.text}</p>}
        {message.img && <img src={message.img} alt="" />}
      </div>
    </div>
  )
}

export default Message;