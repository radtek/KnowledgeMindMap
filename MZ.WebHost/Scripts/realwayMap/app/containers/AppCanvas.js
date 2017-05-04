/**
 * Created by Administrator on 2016/8/9.
 */
'use strict';
import React, { Component } from 'react';


import NodeDot from './NodeDot';
import Menu from './Menu';
import AddMenu from './AddMenu';
import { connect } from 'react-redux';
import enumData from '../config/enumData';
import { setNodePosition, undoNodeModify, todoNodeModify, initNodes } from '../actions/nodeDotAction';

class AppCanvas extends Component {
    constructor(props) {
        super(props);
        this.state = {
            winHeight: $(window).height(),
        };
    }

    componentDidMount() {
        $.get(this.props.initUrl).then((data) => {
            this.props.initNodes(data);
        })


        this.$canvas = $(this.refs.canvas);
        const This = this;
        $(window).resize(function () {
            This.setState({
                winHeight: $(window).height(),
            });
        });
        $(window).on('keydown', function(e) {
            const { activeNodeIndex, setNodePosition, undoNodeModify, todoNodeModify, dots } = This.props;
            if (activeNodeIndex !== undefined) {
                // 点击方向键盘移动节点
                switch (e.keyCode) {
                    case 38:
                        // 方向键 上
                        setNodePosition({
                            index: activeNodeIndex,
                            deltaY: -1,
                        });
                        return false;
                    case 40:
                        // 方向键 下
                        setNodePosition({
                            index: activeNodeIndex,
                            deltaY: 1,
                        });
                        return false;
                    case 37:
                        // 方向键 左
                        setNodePosition({
                            index: activeNodeIndex,
                            deltaX: -1,
                        });
                        return false;
                    case 39:
                        // 方向键 右
                        setNodePosition({
                            index: activeNodeIndex,
                            deltaX: 1,
                        });
                        return false;
                }
            }
            if (e.ctrlKey && e.keyCode === 90) {
                console.log('undo!!!');
                undoNodeModify();
            }

            if (e.ctrlKey && e.keyCode === 89) {
                console.log('todo!!!');
                todoNodeModify();
            }
            return true;
        });
    }
    addNodeHandler(e) {
        this.setState({
            addMenuVisible: true,
            addMenuX: e.pageX + enumData.canvas.offsetX,
            addMenuY: e.pageY + enumData.canvas.offsetY,
        })
        e.stopPropagation();
        e.preventDefault();
    }
    mapScrollHandler(e) {
        enumData.canvas.offsetX = this.$canvas.scrollLeft() - 50;
        enumData.canvas.offsetY = this.$canvas.scrollTop() - 80;
    }
    hideAddMenu() {
        this.setState({
            addMenuVisible: false,
        })
    }
    render() {
        const { dots, menu, activeNodeIndex, background } = this.props;
        return (
            <div id="yh-rm-box" ref="canvas" style={{ height: this.state.winHeight }}  onScroll={this.mapScrollHandler.bind(this)}>
                <div id="yh-rm-railwayMap">
                    <div id="yh-rm-bgImg" onContextMenu={this.addNodeHandler.bind(this)}>
                        <img src={background} alt="" />
                    </div>
                    <div id="yh-rm-overlay">
                        {dots.map((dot, index) => <NodeDot key={index} dotIndex={index} data={dot} isActive={index === activeNodeIndex} />)}
                    </div>
                    {menu.isVisible && (<Menu x={menu.X} y={menu.Y} />)}
                    {this.state.addMenuVisible && (
                        <AddMenu X={this.state.addMenuX} Y={this.state.addMenuY} hideMenu={this.hideAddMenu.bind(this)} />
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        dots: state.get('nodeDot').toJS(),
        menu: state.get('menu').toJS(),
        activeNodeIndex: state.getIn(['appState', 'activeNodeIndex']),
    }),
    { setNodePosition, undoNodeModify, todoNodeModify, initNodes }
)(AppCanvas);