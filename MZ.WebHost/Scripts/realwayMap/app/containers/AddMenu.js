/**
 * Created by Administrator on 2016/8/9.
 */
'use strict';
import React, { Component } from 'react';
import { hideMenu } from '../actions/menuAction';
import enmuData from '../config/enumData';
import { setDotSize, setDotType, setDotText, deleteNote, addNewNode, addCopyNode } from '../actions/nodeDotAction';
import { connect } from 'react-redux';

class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            sizeValue: 12,
            nodeText: '',
        };
    }

    componentDidMount() {
        const menu = this.refs.addmenu;
        const { hideMenu } = this.props;
        $(document).on('click', function tryHideMenu(e) {
            console.log('hello');
            if (!$(e.target).closest(menu).length) {
                hideMenu();
                $(document).off('click', tryHideMenu);
            }
        });
    }
    addNewNode() {
        this.props.addNewNode({
            type: this.props.activeNodeType,
            X: this.props.X,
            Y: this.props.Y,
        });
        this.props.hideMenu();
    }
    addCopyNode() {
        this.props.addCopyNode({
            index: this.props.activeNodeIndex,
            X: this.props.X,
            Y: this.props.Y,
        });
        this.props.hideMenu();
    }
    render() {
        const { activeNodeIndex } = this.props;
        return (
            <div id="yh-rm-addMenu" ref="addmenu" style={{ top: this.props.Y, left: this.props.X }}>
                <a onClick={this.addNewNode.bind(this)} className="yh-rm-btn">添加新节点</a>
                {activeNodeIndex !== undefined && (
                    <a onClick={this.addCopyNode.bind(this)} className="yh-rm-btn mt5">复制选中节点</a>
                )}
            </div>
        );
    }
}

export default connect(
    state => ({
        dots: state.get('nodeDot').toJS(),
        activeNodeIndex: state.getIn(['appState', 'activeNodeIndex']),
        activeNodeType: state.getIn(['appState', 'activeNodeType']),
    }),
    { addNewNode, addCopyNode }
)(Menu);