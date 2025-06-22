import React from 'react';

export default function Footer() {
  return (
    <footer className="bg-gray-200 text-gray-700 text-center py-4 mt-auto">
      <p>&copy; {new Date().getFullYear()} Dealer Admin Portal | All Rights Reserved</p>
    </footer>
  );
}
