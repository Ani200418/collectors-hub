import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import ToastContainer from '../Toast/Toast';
import './Layout.css';

const Layout: React.FC = () => {
  return (
    <div className="layout">
      <Navbar />
      <main className="layout__main">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default Layout;
