import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AlertProvider } from './context/AlertContext';
import { AuthProvider } from './features/authentication';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <AuthProvider>
    {/* <React.StrictMode> */}
      <AlertProvider>
        <App />
      </AlertProvider>
    {/* </React.StrictMode> */}
  </AuthProvider>
);
