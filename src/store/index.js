import {combineReducers, createStore} from "redux";
import input from "./input";
import counter from "./counter";

export const reducer = combineReducers({
    input, counter
});

const Store = createStore(reducer,
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__());
export default Store;