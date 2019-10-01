import { combineReducers } from 'redux';
import appState from './appState/reducer'

const appReducer = combineReducers({
    appState
});

const rootReducer = (state, action) => {
    return appReducer(state, action);
};

export default rootReducer;