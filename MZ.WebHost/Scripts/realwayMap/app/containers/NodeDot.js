/**
 * Created by Administrator on 2016/8/9.
 */
'use strict';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import enumData from '../config/enumData';
import { setDotSize, setDotType, setNodePosition, setTextSize } from '../actions/nodeDotAction';
import { showMenu, hideMenu } from '../actions/menuAction';
import { setActiveNodeIndex } from '../actions/setAppStateAction';

class NodeDot extends Component {
    constructor(props) {
        super(props);
        const { data } = props;
    }
    menuHandler(e) {
        const marginR = $(window).width() - e.pageX;
        const marginB = $(window).height() - e.pageY;
        let offsetX = 0;
        let offsetY = 0;
        if (marginR < 280) {
            offsetX = 280 - marginR;
        }
        if (marginB < 140) {
            offsetY =  140 - marginB;
        }

        this.props.showMenu({
            X: e.pageX + enumData.canvas.offsetX + 10 - offsetX,
            Y: e.pageY + enumData.canvas.offsetY - 50 - offsetY,
        });
        this.props.setActiveNodeIndex(this.props.dotIndex);
        e.preventDefault();
        e.stopPropagation();
    }
    triggerDotMove(ev) {

        const $iconBox = $(this.refs.iconBox);
        const $textBox = $(this.refs.textBox);

        const { dotIndex, setDotPosition, setNodePosition } = this.props;

        const initX = ev.pageX;
        const initY = ev.pageY;
        const initDotTop = $iconBox.position().top;
        const initDotLeft = $iconBox.position().left;
        const initTextTop = $textBox.position().top;
        const initTextLeft = $textBox.position().left;

        let dX, dY;
        function mouseMove(e) {
            dX = e.pageX - initX;
            dY = e.pageY - initY;
            $iconBox.css({top: initDotTop + dY, left: initDotLeft + dX});
            $textBox.css({top: initTextTop + dY, left: initTextLeft + dX});
        }
        function mouseUp(e) {
            $(document).off('mousemove', mouseMove).off('mouseup', mouseUp);
            if (dX && dY) {
                setNodePosition({
                    index: dotIndex,
                    dotY: initDotTop + dY,
                    dotX: initDotLeft + dX,
                    textY: initTextTop + dY,
                    textX: initTextLeft + dX,
                });
            }
        }
        $(document).on('mousemove', mouseMove).on('mouseup', mouseUp);
        this.props.setActiveNodeIndex(this.props.dotIndex);
        ev.preventDefault();
        ev.stopPropagation();
    }
    triggerTextMove(ev) {
        const $textBox = $(this.refs.textBox);

        const initX = ev.pageX;
        const initY = ev.pageY;
        const initTextTop = $textBox.position().top;
        const initTextLeft = $textBox.position().left;

        const { dotIndex, setNodePosition } = this.props;

        let dX, dY;
        function mouseMove(e) {
            dX = e.pageX - initX;
            dY = e.pageY - initY;
            $textBox.css({top: initTextTop + dY, left: initTextLeft + dX});
        }

        function mouseUp(e) {
            $(document).off('mousemove', mouseMove).off('mouseup', mouseUp);
            if (dX && dY) {
                setNodePosition({
                    index: dotIndex,
                    textY: initTextTop + dY,
                    textX: initTextLeft + dX,
                });
            }
        }
        $(document).on('mousemove', mouseMove).on('mouseup', mouseUp);
        this.props.setActiveNodeIndex(this.props.dotIndex);
        ev.preventDefault();
        ev.stopPropagation();
    }
    resize(ev) {
        const $textBox = $(this.refs.textBox);
        const { dotIndex, setTextSize } = this.props;
        const initX = ev.pageX;
        const initY = ev.pageY;
        const initWidth = $textBox.width();
        const initHeight = $textBox.height();

        let width, height;

        function mouseMove(e) {
            width = initWidth + e.pageX - initX;
            height = initHeight + e.pageY - initY;
            $textBox.css({width, height});
        }
        function mouseUp(e) {
            $(document).off('mousemove', mouseMove).off('mouseup', mouseUp);

            setTextSize({
                width,
                height,
                index: dotIndex,
            });
        }
        $(document).on('mousemove', mouseMove).on('mouseup', mouseUp);
        ev.preventDefault();
        ev.stopPropagation();
    }
    resizeHorizontal(ev) {
        const $textBox = $(this.refs.textBox);
        const { dotIndex, setTextSize } = this.props;
        const initX = ev.pageX;
        const initWidth = $textBox.width();
        const height = $textBox.height();

        let width;

        function mouseMove(e) {
            width = initWidth + e.pageX - initX;
            $textBox.css({width});
        }
        function mouseUp(e) {
            $(document).off('mousemove', mouseMove).off('mouseup', mouseUp);

            setTextSize({
                width,
                height,
                index: dotIndex,
            });
        }
        $(document).on('mousemove', mouseMove).on('mouseup', mouseUp);
        ev.preventDefault();
        ev.stopPropagation();
    }
    resizeVertical(ev) {
        const $textBox = $(this.refs.textBox);
        const { dotIndex, setTextSize } = this.props;
        const initY = ev.pageY;
        const width = $textBox.width();
        const initHeight = $textBox.height();

        let height;

        function mouseMove(e) {
            height = initHeight + e.pageY - initY;
            $textBox.css({ height });
        }
        function mouseUp(e) {
            $(document).off('mousemove', mouseMove).off('mouseup', mouseUp);

            setTextSize({
                width,
                height,
                index: dotIndex,
            });
        }
        $(document).on('mousemove', mouseMove).on('mouseup', mouseUp);
        ev.preventDefault();
        ev.stopPropagation();
    }
    setActiveNode() {
        console.log('hhhh');
    }
    render() {
        const { data, isActive } = this.props;
        return (
            <div className="yh-rm-iconBox" onContextMenu ={this.menuHandler.bind(this)} onMouseDown={this.setActiveNode.bind(this)} data-node-id={data.id}>
                {!!data.dot && (
                    <div className={"yh-rm-iconBox-icon " + (isActive ? 'active' : '')} ref="iconBox" style={{ top: data.dot.Y, left: data.dot.X }} onMouseDown={this.triggerDotMove.bind(this)}>
                        <i style={{ fontSize: data.dot.size }} className={`iconfont ${enumData.dotTypes[data.dot.type]}`}></i>
                    </div>
                )}
                <div
                    ref="textBox"
                    className="yh-rm-iconBox-text"
                    style={{ top: data.intro.Y, left: data.intro.X, width: data.intro.width, height: data.intro.height }}
                    onMouseDown={this.triggerTextMove.bind(this)}>
                    <div style={{ color: data.intro.fontColor, fontSize: data.intro.fontSize, textAlign: data.intro.textAlign }}>
                        {data.intro.text}
                    </div>
                    {isActive && (
                        <div>
                            <div onMouseDown={this.resizeHorizontal.bind(this)} className="yh-rm-horizontalHandler"/>
                            <div onMouseDown={this.resizeVertical.bind(this)} className="yh-rm-verticalHandler"/>
                            <div onMouseDown={this.resize.bind(this)} className="yh-rm-resizeHandler"/>
                        </div>
                    )}
                </div>
            </div>
        );
    }
}

export default connect(
    null,
    { setDotSize, setDotType, setNodePosition, setTextSize, showMenu, hideMenu, setActiveNodeIndex }
)(NodeDot);