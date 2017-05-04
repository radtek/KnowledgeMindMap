/**
 * Created by Administrator on 2016/8/9.
 */
'use strict';
import React, { Component } from 'react';
import { hideMenu } from '../actions/menuAction';
import enmuData from '../config/enumData';
import config from '../config/config';
import { setDotSize, setDotType, setDotText, deleteNote, setFontSize, setFontColor, setTextAlign } from '../actions/nodeDotAction';
import { connect } from 'react-redux';


class Menu extends Component {
    constructor(props) {
        super(props);
        this.state = {
            textAlign: props.dots[props.activeNodeIndex].intro.textAlign || 'left',
            fontColor: props.dots[props.activeNodeIndex].intro.fontColor,
            fontSize: props.dots[props.activeNodeIndex].intro.fontSize || config.defaultFontSize,
        };
    }

    componentDidMount() {
        const menu = this.refs.menu;
        const { hideMenu } = this.props;
        $(document).on('click', function tryHideMenu(e) {
            if (!$(e.target).closest(menu).length) {
                hideMenu();
                $(document).off('click', tryHideMenu);
            }
        });
    }
    handleIconSizeChange(e) {
        this.setState({
            sizeValue: e.target.value,
        });
        this.props.setDotSize({
            index: this.props.activeNodeIndex,
            size: e.target.value,
        });
    }
    handleIconTextChange(e) {
        this.setState({
            nodeText: e.target.value,
        });
        this.props.setDotText({
            index: this.props.activeNodeIndex,
            text: e.target.value,
        });
    }
    setDotType(type) {
        this.props.setDotType({
            type,
            index: this.props.activeNodeIndex,
        });
    }
    deleteCurrentNode() {
        const { activeNodeIndex, deleteNote, hideMenu } = this.props;
        deleteNote(activeNodeIndex);
        hideMenu();
    }
    handleFontSizeChange(e) {
        console.log(e.target.value);
        this.props.setFontSize({
            index: this.props.activeNodeIndex,
            text: e.target.value,
        });
        this.setState({
            fontSize: e.target.value,
        });
    }
    handleFontColorChange(e) {
        console.log(11);
        console.log(e.target.value);
        this.setState({
            fontColor: e.target.value,
        });
    }
    handleFontColorBlur(e) {
        this.props.setFontColor({
            index: this.props.activeNodeIndex,
            text: e.target.value,
        });
        this.setState({
            fontColor: e.target.value,
        });
    }
    handleTextAlignChange(e) {
        console.log(e.target.value);
        this.props.setTextAlign({
            index: this.props.activeNodeIndex,
            text: e.target.value,
        });
        this.setState({
            textAlign: e.target.value,
        });
    }
    render() {
        const { dots, activeNodeIndex, deleteNote } = this.props;
        const typeItems = [];
        let dotSetting;
        if (dots[activeNodeIndex].dot) {
            for (let type in enmuData.dotTypes) {
                typeItems.push(
                    <li key={type} onClick={this.setDotType.bind(this, type)} className={type === dots[activeNodeIndex].dot.type ? 'active' : ''}>
                        <i className={`iconfont ${enmuData.dotTypes[type]}`}></i>
                    </li>
                )
            }
            dotSetting = (
                <div>
                    <h3>设置图标：</h3>
                    <label>图标大小：<input type="number" value={dots[activeNodeIndex].dot.size} onChange={this.handleIconSizeChange.bind(this)} id="yh-rm-menu-iconSize" /></label>
                    <div>
                        <h3>图标类型：</h3>
                        <ul id="yh-rm-menu-iconType" className="clearfix">
                            {typeItems}
                        </ul>
                    </div>
                </div>
            )
        }
        return (
            <div id="yh-rm-menu" ref="menu" style={{ top: this.props.y, left: this.props.x }}>
                {dotSetting}
                <div>
                    <h3>编辑内容：</h3>
                    <textarea onChange={this.handleIconTextChange.bind(this)} value={dots[activeNodeIndex].intro.text} id="yh-rm-menu-text" />
                </div>
                <div>
                    <h3>字体大小</h3>
                    <input className="w50" style={{width: 50}} type="number" onChange={this.handleFontSizeChange.bind(this)} value={this.state.fontSize} />
                </div>
                <div>
                    <h3>字体颜色</h3>
                    <input type="color" onBlur={this.handleFontColorBlur.bind(this)} onChange={this.handleFontColorChange.bind(this)} value={this.state.fontColor} />
                </div>
                <div>
                    <h3>对齐方式</h3>
                    <label>左<input type="radio" name="textAlign" id="" value="left" onChange={this.handleTextAlignChange.bind(this)} checked={this.state.textAlign === 'left'}/> </label>
                    <label>中<input type="radio" name="textAlign" id="" value="center" onChange={this.handleTextAlignChange.bind(this)} checked={this.state.textAlign === 'center'}/> </label>
                    <label>右<input type="radio" name="textAlign" id="" value="right" onChange={this.handleTextAlignChange.bind(this)} checked={this.state.textAlign === 'right'}/> </label>
                </div>
                <div>
                    <a onClick={this.deleteCurrentNode.bind(this)} className="yh-rm-btn">删除</a>
                </div>
            </div>
        );
    }
}

export default connect(
    state => ({
        dots: state.get('nodeDot').toJS(),
        activeNodeIndex: state.getIn(['appState', 'activeNodeIndex']),
    }),
    { hideMenu, setDotSize, setDotType, setDotText, deleteNote, setFontSize, setFontColor, setTextAlign }
)(Menu);