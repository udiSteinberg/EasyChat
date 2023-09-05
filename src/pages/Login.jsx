import React, { useState } from 'react';
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../Firebase';

const Login = () => {


  const [err, setErr] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/');
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className='formContainer'>
      <div className="formWrapper">
        <span className="logo">Easy Chat</span>
        <span className="title">Sign In</span>
        <form onSubmit={handleSubmit}>
          <input type='email' placeholder='Email' />
          <input type='password' placeholder='Password' />
          <button>Sign In</button>
          {err && <span style={ {backgroundColor: 'pink',border: '2px solid red',borderRadius: '8px'}}>Invalid username or password.<br></br>Please check your credentials and try again</span>}
        </form>
        <p>Don't have an account? <Link to={"/register"}>Sign Up</Link></p>
      </div>
    </div>
  )
}

export default Login;