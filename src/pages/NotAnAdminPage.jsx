import React from 'react';
import { Link } from 'react-router-dom';

export const NotAnAdmin = () => {
  return (
    <div className='page404'>
        <h1>You are not an admin</h1>
        <Link to='/'>Back to home page</Link>
    </div>
  )
}
