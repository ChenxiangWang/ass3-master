import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { Route, Routes } from 'react-router';
import { Provider } from 'react-redux';
import { store } from './store';

ReactDOM.render(
      <BrowserRouter>
          <Provider store={store}>
              <Routes>
                  <Route path={'/*'} element={<App/>}/>
              </Routes>
          </Provider>
      </BrowserRouter>,
      document.getElementById('root'),
);
