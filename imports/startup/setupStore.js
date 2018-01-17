
import { createStore, applyMiddleware } from 'redux';
import thunk                            from 'redux-thunk';

import { appReducer } from '../reducers';
import { fetchTasks } from '../actions';


export const setupStore = () => {
    store = createStore(appReducer, applyMiddleware(thunk));
    store.dispatch(fetchTasks());
    return store;
}
