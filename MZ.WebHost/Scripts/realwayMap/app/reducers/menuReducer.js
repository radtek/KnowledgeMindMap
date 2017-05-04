'use strict';
import actionTypes from '../actions/actionTypes';
import { fromJS } from 'immutable';
const initState = fromJS({
    isVisible: false,
    X: 0,
    Y: 0,
});

const menu = function (state = initState, action = {}) {
    switch (action.type) {
        case actionTypes.showMenu:
            return state.set('isVisible', true).set('X', action.payload.X).set('Y', action.payload.Y);
        case actionTypes.hideMenu:
            return state.set('isVisible', false);
        default:
            return state;
    }

    return state;
};

export default menu;