import { signOut } from 'firebase/auth';
import React, {useContext} from 'react'
import { auth } from '../Firebase';
import { AuthContext } from '../cotext/AuthContext';
import { ChatContext } from '../cotext/ChatContext';

const Navbar = () => {
  const {currentUser} = useContext(AuthContext);
  const { dispatch } = useContext(ChatContext);

  const logout = () =>{
    signOut(auth);
    dispatch({type:"LOGOUT"})
  }
  return (
    <div className='navbar'>
      <span className="logo">Easy Chat</span>
      <div className="user">
        <img  src={currentUser.photoURL} alt="" />
        <span>{currentUser.displayName}</span>
        <button onClick={logout}>logout</button>
      </div>
    </div>
  )
}

export default Navbar;