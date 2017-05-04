'use strict';
import actionTypes from './actionTypes';

export function initNodes(data) {
    return {
        type: actionTypes.initNodes,
        payload: data,
    };
}
export function undoNodeModify() {
    return {
        type: actionTypes.undoNodeModify,
    };
}
export function todoNodeModify() {
    return {
        type: actionTypes.todoNodeModify,
    };
}
export function addNewNode(data) {
    return {
        type: actionTypes.addNewNode,
        payload: data,
    };
}
export function addCopyNode(data) {
    return {
        type: actionTypes.addCopyNode,
        payload: data,
    };
}
export function deleteNote(index) {
    return {
        type: actionTypes.deleteNote,
        payload: index,
    };
}
export function setNodePosition(data) {
    return {
        type: actionTypes.setNodePosition,
        payload: data,
    };
}
export function setDotType(data) {
    return {
        type: actionTypes.setDotType,
        payload: data,
    };
}
export function setDotSize(data) {
    return {
        type: actionTypes.setDotSize,
        payload: data,
    };
}
export function setDotText(data) {
    return {
        type: actionTypes.setDotText,
        payload: data,
    };
}
export function setTextSize(data) {
    return {
        type: actionTypes.setTextSize,
        payload: data,
    };
}
export function setFontSize(data) {
    return {
        type: actionTypes.setFontSize,
        payload: data,
    };
}
export function setFontColor(data) {
    return {
        type: actionTypes.setFontColor,
        payload: data,
    };
}
export function setTextAlign(data) {
    return {
        type: actionTypes.setTextAlign,
        payload: data,
    };
}
