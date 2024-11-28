import React from 'react';
import Navbar from './navbar';

const Layout = ({ children, setAuth, auth }) => {
  return (
    <>
      <Navbar setAuth={setAuth}/>
      <div className="content">
        {children}
      </div>
    </>
  );
};

export default Layout;