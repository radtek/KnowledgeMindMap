'use strict';
import actionTypes from './actionTypes';

export function showMenu(data) {
    return {
        type: actionTypes.showMenu,
        payload:data,
    };
}

export function hideMenu(data) {
    return {
        type: actionTypes.hideMenu,
    };
}
