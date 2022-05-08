import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  ApolloLink,
  from
} from '@apollo/client';

//replaces createhttplink to enable uploading to this file for my blog posts
import { createUploadLink } from 'apollo-upload-client';



const jwtAuth = process.env.REACT_APP_JWT_SECRET;

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(({ headers }) => {
    const token = localStorage.getItem(jwtAuth);
   
    return {
      headers: {
        ...headers,
        Accept: 'application/json',
        Authorization: token ? `Bearer ${localStorage.getItem(jwtAuth)}` : '', // however you get your token
      },
    };
  });
 
  return forward(operation);
});


const customFetch = (uri, options) => {
  return fetch(uri, options).then(async (response) => {
    try {
      if (response.status >= 500) {
        // or handle 400 errors
        return Promise.reject(response.status);
      }
      
      return response
      
    } catch (error) {
      console.error('big errr', error)
    }
    
  });
};
let link
if(process.env.NODE_ENV === 'production') {
 console.log('production true')
  link = '/graphql';
} else {
  console.log('development true');
  link = 'http://localhost:4000/graphql';
}


const httpLink = createUploadLink({
  uri: link,
  fetch: customFetch,
});
console.log('here', httpLink)
//for heroku build 
//http://localhost:4000/graphql
//https://brennanskinner.herokuapp.com/graphql
console.log('here', httpLink)
console.log('another', customFetch())
// console.log('another build', reponseFix);
const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: from([authLink, httpLink]),
});


ReactDOM.render(
  <BrowserRouter>
    <ApolloProvider client={client}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </ApolloProvider>
  </BrowserRouter>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
