import React, { useContext, useState } from 'react';
import Img from '../img/add-image.png';
import Emoji from '../img/Emoji.png';
import { AuthContext } from '../cotext/AuthContext';
import { ChatContext } from '../cotext/ChatContext';
import { v4 as uuid } from 'uuid';
import { Timestamp, arrayUnion, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db, storage } from '../Firebase';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import EmojiPicker from 'emoji-picker-react';

const Input = () => {
  const [text, setText] = useState("");
  const [img, setImg] = useState(null);
  const [showPicker, setShowPicker] = useState(false);

  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const handleSend = async () => {
    if (img) {
      const fileName = uuid();
      const storageRef = ref(storage, fileName);

      const uploadTask = uploadBytesResumable(storageRef, img);

      console.log(uploadTask);
      uploadTask.on('state_changed',
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        },
        (error) => {
          //TODO:Handle Error
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log(downloadURL);
            updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: fileName,
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                img: downloadURL,
              }),
            });
          });
        }
      );
    } else if (text !== "") {
      console.log(currentUser.uid);
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }


    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImg(null);
    setShowPicker(false)
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && data.user.hasOwnProperty('displayName')) {
      handleSend();
    }
  };

  const handleEmojiClick = (event) => {
    console.log(event.emoji);
    setText(text + event.emoji);
  };

  return (
    <div className="input">
      <input
        type="text"
        placeholder="Message"
        onChange={(e) => setText(e.target.value)}
        value={text}
        onKeyPress={handleKeyPress}
        onClick={() => setShowPicker(false)}
      />
      <button onClick={() => setShowPicker(!showPicker)} style={{ display: "none" }} id='emoji-btn'
      >Add Emoji</button>
      <label htmlFor="emoji-btn">
        <img style={{height:'24px', cursor: 'pointer', marginRight: '6px'}} src={Emoji} alt="" />
      </label>
      {showPicker && <div className='emoji-box'>
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </div>}
      <div className="send">
        <input
          type="file"
          style={{ display: "none" }}
          id="file"
          onChange={(e) => setImg(e.target.files[0])}
        />
        {img && <span>Ready to send img</span>}
        <label htmlFor="file">
          <img src={Img} alt="" />
        </label>
        {data.user.hasOwnProperty('displayName') && <button onClick={handleSend}>Send</button>}
      </div>
    </div>
  );
};

export default Input;
