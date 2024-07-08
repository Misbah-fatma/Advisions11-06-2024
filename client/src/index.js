import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import {Provider} from 'react-redux'
import store from './redux/store';
import { BrowserRouter} from "react-router-dom";
import './i18n';
import { GoogleOAuthProvider } from '@react-oauth/google';

ReactDOM.render(
  <React.StrictMode>
      <Provider store={store}>
      <GoogleOAuthProvider clientId="807092733018-ojbni2hj2cu57p0832dfhdfehglojut0.apps.googleusercontent.com">
    <App />
    </GoogleOAuthProvider>
  </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);


