'use strict';
import actionTypes from './actionTypes';

export function setActiveNodeType(type) {
    return {
        type: actionTypes.setActiveNodeType,
        payload: type,
    };
}

export function setActiveNodeIndex(index) {
    return {
        type: actionTypes.setActiveNodeIndex,
        payload: index,
    };
}
