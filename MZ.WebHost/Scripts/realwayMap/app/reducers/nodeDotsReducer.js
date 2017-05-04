/**
 * Created by Administrator on 2016/8/9.
 */
'use strict';
import { fromJS } from 'immutable';
import actionTypes from '../actions/actionTypes';
const initState = fromJS([]);
let nodeId = 0;
const stateManage = (function () {
    const stateHistory = [];
    let undoHistory = [];
    let initState;
    return {
        init: function(state) {
            initState = state;
            return state;
        },
        push: function (newState) {
            undoHistory = [];
            stateHistory.push(newState);
            if (stateHistory.length > 60) stateHistory.shift();
            return newState;
        },
        pop: function () {
            undoHistory.push(stateHistory.pop());
            if (stateHistory.length) {
                return stateHistory[stateHistory.length - 1];
            } else {
                return initState;
            }
        },
        back: function () {
            console.log('undoHistory.length', undoHistory.length);
            if (undoHistory.length) {
                stateHistory.push(undoHistory.pop());
            }
            console.log(stateHistory[stateHistory.length - 1].toJS());
            return stateHistory[stateHistory.length - 1];
        },
        length: function () {
            return stateHistory.length;
        }
    };
})();
stateManage.init(initState);
const initDot = fromJS(
    {
        dot: {
            type: '0',
            size: 16,
        },
        intro: {
            text: '右键编辑!',
            width: 100,
            height: 50,
        }
    }
);
const initText = fromJS(
    {
        intro: {
            X: 0,
            Y: 0,
            text: '右键编辑!',
            width: 100,
            height: 50,
        }
    }
);

const nodeDotsReducer = function (state = initState, action = {}) {
    let newNode;
    switch (action.type) {
        case actionTypes.initNodes:
            action.payload.forEach(node => {
                if (node.id > nodeId) nodeId = node.id;
            })
            return stateManage.init(fromJS(action.payload));
        case actionTypes.addNewNode:
            // 区分复制的节点是否是纯文本节点
            if (action.payload.type === 'text') {
                newNode = initText
                    .setIn(['id'], ++nodeId)
                    .setIn(['intro', 'X'], action.payload.X)
                    .setIn(['intro', 'Y'], action.payload.Y + 30);
            } else {
                newNode = initDot
                    .setIn(['id'], ++nodeId)
                    .setIn(['dot', 'X'], action.payload.X)
                    .setIn(['dot', 'Y'], action.payload.Y)
                    .setIn(['dot', 'type'], action.payload.type === undefined ? 0 : action.payload.type)
                    .setIn(['intro', 'X'], action.payload.X)
                    .setIn(['intro', 'Y'], action.payload.Y + 30);
            }
            return stateManage.push(state.push(newNode));
        case actionTypes.addCopyNode:
            // 区分复制的节点是否是纯文本节点
            if (state.getIn([action.payload.index, 'dot'])) {
                newNode = state.get(action.payload.index)
                    .setIn(['id'], ++nodeId)
                    .setIn(['dot', 'X'], action.payload.X)
                    .setIn(['dot', 'Y'], action.payload.Y)
                    .setIn(['intro', 'X'], action.payload.X)
                    .setIn(['intro', 'Y'], action.payload.Y + 30);

            } else {
                newNode = state.get(action.payload.index)
                    .setIn(['id'], ++nodeId)
                    .setIn(['intro', 'X'], action.payload.X)
                    .setIn(['intro', 'Y'], action.payload.Y + 30);
            }
            return stateManage.push(state.push(newNode));
        case actionTypes.deleteNote:
            return stateManage.push(state.delete(action.payload));
        case actionTypes.setNodePosition:
            const dX = action.payload.deltaX || 0;
            const dY = action.payload.deltaY || 0;
            if (state.getIn([action.payload.index, 'dot'])) {
                return stateManage.push(state
                    .updateIn([action.payload.index,'dot', 'X'], oldValue => action.payload.dotX || oldValue + dX)
                    .updateIn([action.payload.index,'dot', 'Y'], oldValue => action.payload.dotY || oldValue + dY)
                    .updateIn([action.payload.index,'intro', 'X'], oldValue => action.payload.textX || oldValue + dX)
                    .updateIn([action.payload.index,'intro', 'Y'], oldValue => action.payload.textY || oldValue + dY));

            } else {
                return stateManage.push(state
                    .updateIn([action.payload.index,'intro', 'X'], oldValue => action.payload.textX || oldValue + dX)
                    .updateIn([action.payload.index,'intro', 'Y'], oldValue => action.payload.textY || oldValue + dY));
            }
        case actionTypes.setTextSize:
            console.log(action.payload);
            return stateManage.push(state
                .setIn([action.payload.index,'intro', 'width'], action.payload.width)
                .setIn([action.payload.index,'intro', 'height'], action.payload.height));
        case actionTypes.setDotSize:
            return stateManage.push(state
                .setIn([action.payload.index,'dot', 'size'], action.payload.size));
        case actionTypes.setDotType:
            return stateManage.push(state
                .setIn([action.payload.index,'dot', 'type'], action.payload.type));
        case actionTypes.setDotText:
            return stateManage.push(state
                .setIn([action.payload.index,'intro', 'text'], action.payload.text));
        case actionTypes.setFontSize:
            return stateManage.push(state
                .setIn([action.payload.index,'intro', 'fontSize'], action.payload.text));
        case actionTypes.setFontColor:
            return stateManage.push(state
                .setIn([action.payload.index,'intro', 'fontColor'], action.payload.text));
        case actionTypes.setTextAlign:
            return stateManage.push(state
                .setIn([action.payload.index,'intro', 'textAlign'], action.payload.text));
        case actionTypes.undoNodeModify:
            return stateManage.pop();
        case actionTypes.todoNodeModify:
            return stateManage.back();
        default:
            return state;
    }
}
export default nodeDotsReducer;
