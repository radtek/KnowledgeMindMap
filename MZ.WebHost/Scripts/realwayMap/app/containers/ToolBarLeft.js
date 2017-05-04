/**
 * Created by Administrator on 2016/8/9.
 */
'use strict';
import React, { Component } from 'react';
import enmuData from '../config/enumData';
import { connect } from 'react-redux';
import { setActiveNodeType } from '../actions/setAppStateAction';

class ToolBarLeft extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    setCurDotType(type) {
        const { activeNodeType, setActiveNodeType } = this.props;
        if (activeNodeType === type) {
            setActiveNodeType();
        } else {
            setActiveNodeType(type);
        }
    }
    saveData() {
        $.post(this.props.saveUrl, { data: JSON.stringify(this.props.dots)});
    }
    render() {
        const { activeNodeType } = this.props;
        const typeItems = [];
        for (let type in enmuData.dotTypes) {
            typeItems.push(
                <li key={type} onClick={this.setCurDotType.bind(this, type)} className={activeNodeType === type && 'active'}>
                    <i className={`iconfont ${enmuData.dotTypes[type]}`}></i>
                </li>
            )
        }
        {
            let type = 'text';
            typeItems.push(
                <li key={type} onClick={this.setCurDotType.bind(this, type)} className={['center ' + (activeNodeType === type ? 'active' : '')]}>
                    <i className="iconfont">T</i>
                </li>
            )
        }
        return (
            <div>
                <div id="yh-rm-toolbar">
                    <ul>
                        {typeItems}
                    </ul>
                    <div>
                        <a href="#" onClick={this.saveData.bind(this)}>S</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        activeNodeType: state.getIn(['appState', 'activeNodeType']),
        dots: state.get('nodeDot').toJS(),
    }),
    { setActiveNodeType }
)(ToolBarLeft);