/**
 * Created by Administrator on 2016/8/9.
 */
import { combineReducers } from 'redux-immutablejs';

import nodeDotsReducer from './nodeDotsReducer';
import menuReducer from './menuReducer';
import appStateReducer from './appStateReducer';

export default combineReducers({
    nodeDot: nodeDotsReducer,
    menu: menuReducer,
    appState: appStateReducer,
});
