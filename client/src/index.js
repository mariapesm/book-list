import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunkMiddleware from 'redux-thunk';
import reduxLogger from 'redux-logger';
import throttle from 'lodash/throttle';

import { reducer } from './assets/reducer';

import 'semantic-ui-css/semantic.min.css';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

let persistentState = {account: undefined, book: undefined};

if(localStorage.bookFlow){
	persistentState.account = JSON.parse(localStorage.bookFlow);
}

const middlewares = [thunkMiddleware];

if(process.env.NODE_ENV !== 'production'){
	middlewares.push(reduxLogger);
}

const store = createStore(reducer, persistentState, applyMiddleware(...middlewares));

store.subscribe(throttle(() => {
	localStorage.bookFlow = JSON.stringify(store.getState().account)
}, 1000));

ReactDOM.render(
	<Provider store={store}>
		<App />
	</Provider>, document.getElementById('root'));
registerServiceWorker();
