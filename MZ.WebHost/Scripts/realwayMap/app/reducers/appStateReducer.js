'use strict';
import actionTypes from '../actions/actionTypes';
import { fromJS } from 'immutable';
const initState = fromJS({
    activeNodeIndex: undefined,
    activeNodeType: undefined,
});

const appState = function (state = initState, action = {}) {
    switch (action.type) {
        case actionTypes.setActiveNodeType:
            return state.set('activeNodeType', action.payload);
        case actionTypes.setActiveNodeIndex:
            return state.set('activeNodeIndex', action.payload);
        default:
            return state;
    }

    return state;
};

export default appState;