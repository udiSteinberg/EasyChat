import React from 'react';
import { Link } from 'react-router-dom';

export const Page404 = () => {
  return (
    <div className='page404'>
        <h1>Page 404 Not Found</h1>
        <Link to='/'>Back to home page</Link>
    </div>
  )
}
