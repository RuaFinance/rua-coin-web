import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from '../components/Header';

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      <Header />
      <Outlet />
    </div>
  );
};

export default Layout;