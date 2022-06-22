import React from 'react';
import ReactDOM from 'react-dom';
import './assets/styles/main.css';
import App from "./App";
import { AuthContextProvider } from "./context/AuthContext";
import { SearchContextProvider } from "./context/SearchContext";
import { SocketContextProvider } from "./context/SocketContext";



ReactDOM.render(
  <React.StrictMode>
    <SocketContextProvider>
      <SearchContextProvider>
        <AuthContextProvider>
          <App />
        </AuthContextProvider>
      </SearchContextProvider>
    </SocketContextProvider>
  </React.StrictMode>,
  document.getElementById('root')
);