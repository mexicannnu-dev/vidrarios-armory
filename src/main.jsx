import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.jsx';
import '../style.css';

if (/^https?:$/.test(location.protocol) && /\/index\.html$/.test(location.pathname)) {
    history.replaceState(null, '', location.pathname.replace(/index\.html$/, '') + location.search);
}

createRoot(document.getElementById('root')).render(<StrictMode><App /></StrictMode>);
