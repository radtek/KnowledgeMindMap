/**
 * Created by Administrator on 2015/1/5.
 */
require.config({
    paths: {
        'jquery': '/Yinhe.WebHost/Scripts/Reference/jquery-1.11.1',
        'jq_ui':'/Yinhe.WebHost/Scripts/Reference/jQuery/JQueryUi_bs/jquery-ui-1.9.2.custom',
        'bootstrap':'',
        'livequery':'/Yinhe.WebHost/Scripts/Reference/jQuery/livequery',
        'jq_yinhoo':'/Yinhe.WebHost/Scripts/Modules/jquery.yinhoo_amd&cmd',
        'codemirror':'/Yinhe.WebHost/Scripts/Reference/codemirror-4.10/lib/codemirror',

        'cm_xml':'/Yinhe.WebHost/Scripts/Reference/codemirror-4.10/mode/xml/xml',
        'cm_javascript':'/Yinhe.WebHost/Scripts/Reference/codemirror-4.10/mode/javascript/javascript',
        'cm_css':'/Yinhe.WebHost/Scripts/Reference/codemirror-4.10/mode/css/css',
        'cm_htmlmixed':'/Yinhe.WebHost/Scripts/Reference/codemirror-4.10/mode/htmlmixed/htmlmixed',
        'cm_matchbrackets':'/Yinhe.WebHost/Scripts/Reference/codemirror-4.10/addon/edit/matchbrackets'
    },
    map: {
        '*': {
            'css': 'js/requirejs/css'
        }
    }
});
