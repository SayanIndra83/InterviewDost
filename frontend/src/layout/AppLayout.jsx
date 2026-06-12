import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar.jsx';
export default function AppLayout() {
  return (
    <div className="app-layout">
      <Navbar/>
      <main className="page-content">
        <Outlet /> 
      </main>
    </div>
  );
}