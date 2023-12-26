import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';

import { GithubProvider } from './context/context';
import { Auth0Provider } from '@auth0/auth0-react';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(
  // <React.StrictMode>
  <Auth0Provider
    domain='dev-7f2v1q63vq74bidy.us.auth0.com'
    clientId='0EdkGJVLdU8a1Cy85pR4XQcpQnC14X97'
    authorizationParams={{
      redirect_uri: window.location.origin,
    }}
    cacheLocation='localstorage'
  >
    <GithubProvider>
      <App />
    </GithubProvider>
  </Auth0Provider>
  // </React.StrictMode>
);
