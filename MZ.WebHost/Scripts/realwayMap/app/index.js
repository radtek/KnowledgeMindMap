import React from 'react';
import ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';
import AppBody from './containers/AppBody';
import reducers from './reducers/rootReducer';

const store = createStore(reducers)
function App(props) {
    return (
        <Provider store={store}>
            <AppBody {...props} />
        </Provider>
    )
}
const container = document.getElementById('container');

ReactDOM.render(<App saveUrl={container.dataset.savaUrl} initUrl={container.dataset.initUrl} background={container.dataset.background} />, container);


