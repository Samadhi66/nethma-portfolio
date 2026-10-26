import React from 'react';
import { createRoot, hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/manrope/latin-800.css';
import '@fontsource/bebas-neue/latin-400.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import './styles.css';
import App from './App';

const root = document.getElementById('root');
const app = <React.StrictMode><BrowserRouter><App/></BrowserRouter></React.StrictMode>;
// A static host may return the homepage fallback for an unknown/deep URL.
// Hydrate only when its prerendered route matches the requested route.
const requestedPath = window.location.pathname.replace(/\/$/, '') || '/';
if (root.hasChildNodes() && root.dataset.route === requestedPath) hydrateRoot(root, app); else createRoot(root).render(app);
