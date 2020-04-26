import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import ApolloClient, { gql } from 'apollo-boost';

const client = new ApolloClient({ uri: 'http://localhost:4000/' });

const query = gql`
  {
    hello
  }
`;

client
  .query({ query })
  .then(({ data }) => console.log('data', data))
  .catch(console.error);

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
