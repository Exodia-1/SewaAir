import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// Suppress ResizeObserver error
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
const resizeObserverLoopErr = /^ResizeObserver loop completed with undelivered notifications/;
const consoleError = console.error;
console.error = (...args) => {
  const firstArg = args[0];
  if (typeof firstArg === 'string') {
    if (
      resizeObserverLoopErrRe.test(firstArg) ||
      resizeObserverLoopErr.test(firstArg)
    ) {
      return;
    }
  }
  consoleError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);