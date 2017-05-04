/**
 * Created by Administrator on 2016/8/9.
 */
'use strict';
import React, { Component } from 'react';

import ToolBarLeft from './ToolBarLeft';
import AppCanvas from './AppCanvas';

class AppBody extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div>
                <ToolBarLeft  {...this.props}/>
                <AppCanvas {...this.props}/>
            </div>
        );
    }
}

export default AppBody;