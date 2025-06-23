import React from 'react';
import Header from './Header';
import Footer from './Footer';
import { Outlet } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000, // how long it auto disappears
          style: {
            background: '#fff',
            color: '#333',
            border: '1px solid #ddd',
            padding: '12px 16px',
            borderRadius: '8px',
          },
        }}
      />
      <Header />
      <main className="flex-grow bg-gray-50 overflow-x-hidden">
        <div className="max-w-screen-xl mx-auto w-full px-4">
    <Outlet />
  </div>
      </main>
      <Footer />
    </div>
  );
}
