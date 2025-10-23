import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Comprehensive ResizeObserver error suppression
window.addEventListener('error', (e) => {
  if (
    e.message.includes('ResizeObserver') ||
    e.message.includes('resize observer')
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

window.addEventListener('unhandledrejection', (e) => {
  if (
    e.reason?.message?.includes('ResizeObserver') ||
    e.reason?.message?.includes('resize observer')
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
    return false;
  }
});

// Suppress console errors for ResizeObserver
const consoleError = console.error;
console.error = (...args) => {
  const firstArg = args[0];
  if (typeof firstArg === 'string') {
    if (
      firstArg.includes('ResizeObserver') ||
      firstArg.includes('resize observer')
    ) {
      return;
    }
  }
  consoleError.apply(console, args);
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);