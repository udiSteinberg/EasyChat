import React, { useContext, useState } from 'react';
import Messages from '../components/Messages';
import Input from '../components/Input';
import { ChatContext } from '../cotext/ChatContext';
import more from '../img/more.png';
import { NavLink } from 'react-router-dom';

const Chat = () => {
    const { data } = useContext(ChatContext);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className='chat'>
            <div className="chatInfo">
                <span>{data.user?.displayName || 'Hi, Please select a chat to start chatting'}</span>
                <img className="more-icon" onClick={() => { setIsMenuOpen(true) }} src={more} alt="" />
                {isMenuOpen && (
                    <div className="menu">
                        <ul>
                            <li><NavLink to={'/updateProfile'} className="active-link">Update profile</NavLink></li>
                            <li><NavLink to={'/admin'} className="active-link">Admin options</NavLink></li>
                            <li onClick={() => { setIsMenuOpen(false) }}>Close menu</li>
                        </ul>
                    </div>
                )}
            </div>
            <Messages />
            <Input />
        </div>
    )
}

export default Chat;
