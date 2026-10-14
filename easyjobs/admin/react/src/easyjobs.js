import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
const element = document.getElementById('easyjobs-react');
if (element) {
  // React 18 (WordPress 6.6+) exposes createRoot on the WP-provided ReactDOM
  // global. Fall back to the legacy render API on older WordPress that still
  // ships React 16/17, so the plugin keeps working across supported WP versions.
  if (typeof ReactDOM.createRoot === 'function') {
    ReactDOM.createRoot(element).render(<App />);
  } else {
    ReactDOM.render(<App />, element);
  }
}
