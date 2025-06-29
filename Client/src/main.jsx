import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './app.css'; // ✅ Use this instead of index.css

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
