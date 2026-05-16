import React from 'react';
import ReactDOM from 'react-dom/client';
import './storage'; // attaches window.storage backed by Firestore
import PoloChukkas from './PoloChukkas.jsx';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <PoloChukkas />
  </React.StrictMode>
);
