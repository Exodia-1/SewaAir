import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import ErrorBoundary from './components/ErrorBoundary';

// Immediately suppress ResizeObserver errors before anything else loads
const suppressResizeObserverError = () => {
  const resizeObserverError = /ResizeObserver/i;
  
  // Override window.onerror
  const originalOnError = window.onerror;
  window.onerror = function(message, source, lineno, colno, error) {
    if (typeof message === 'string' && resizeObserverError.test(message)) {
      return true; // Prevent error from propagating
    }
    if (originalOnError) {
      return originalOnError.call(this, message, source, lineno, colno, error);
    }
    return false;
  };

  // Override window error event listener
  window.addEventListener('error', (event) => {
    if (resizeObserverError.test(event.message)) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, { capture: true });

  // Override unhandled rejection
  window.addEventListener('unhandledrejection', (event) => {
    if (event.reason && resizeObserverError.test(event.reason.message || '')) {
      event.stopImmediatePropagation();
      event.preventDefault();
    }
  }, { capture: true });

  // Monkey patch ResizeObserver to catch errors internally
  if (typeof ResizeObserver !== 'undefined') {
    const OriginalResizeObserver = window.ResizeObserver;
    window.ResizeObserver = class extends OriginalResizeObserver {
      constructor(callback) {
        super((entries, observer) => {
          requestAnimationFrame(() => {
            try {
              callback(entries, observer);
            } catch (e) {
              if (!resizeObserverError.test(e.message)) {
                throw e;
              }
            }
          });
        });
      }
    };
  }

  // Override console.error
  const originalConsoleError = console.error;
  console.error = function(...args) {
    const firstArg = args[0];
    if (typeof firstArg === 'string' && resizeObserverError.test(firstArg)) {
      return;
    }
    originalConsoleError.apply(console, args);
  };
};

// Execute suppression immediately
suppressResizeObserverError();

// Disable React's error overlay for ResizeObserver
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    if (/ResizeObserver/i.test(args[0])) {
      return;
    }
    originalError(...args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </React.StrictMode>
);