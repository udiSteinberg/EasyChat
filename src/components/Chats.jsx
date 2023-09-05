import React, { useContext, useState } from 'react';
import { useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../Firebase';
import { AuthContext } from '../cotext/AuthContext';
import { ChatContext } from '../cotext/ChatContext';

const Chats = () => {
  const [chats, setChats] = useState([]);

  const { currentUser } = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      const unsub = onSnapshot(doc(db, 'userChats', currentUser.uid), (doc) => {
        setChats(doc.data());
      });

      return () => {
        unsub();
      };
    };

    currentUser.uid && getChats();
  }, [currentUser.uid]);

  const handleSelect = (u) => {
    dispatch({ type: 'CHANGE_USER', payload: u });
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="chats-container">
      <div className="chats-list">
        {Object.entries(chats)
          ?.sort((a, b) => b[1].date - a[1].date)
          .map((chat) => {
            const date = new Date(chat[1].date?.seconds * 1000);
            const formattedDate = `${date
              .getHours()
              .toString()
              .padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
            const displayDate = isToday(date)
              ? formattedDate
              : `${date.getDate()}/${date.getMonth() + 1}`;

            return (
              <div
                className="userChat"
                key={chat[0]}
                onClick={() => handleSelect(chat[1].userInfo)}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '10px',
                    padding: '10px',
                    alignItems: 'center',
                  }}
                >
                  <img src={chat[1].userInfo.photoURL} alt="" />
                  <div className="userChatInfo">
                    <span>{chat[1].userInfo.displayName}</span>
                    <p>{chat[1].lastMessage?.text}</p>
                  </div>
                </div>
                <p>{displayDate}</p>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default Chats;
