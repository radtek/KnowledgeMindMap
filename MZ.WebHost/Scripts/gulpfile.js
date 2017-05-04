const gulp = require('gulp'),
    minifycss = require('gulp-minify-css'),
    concat = require('gulp-concat'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    del = require('del');


gulp.task('minifyjs_zy', function() {
    del('bundle/zy.bundle.js');
    return gulp.src([
        //'Reference/jquery-1.7.2.min.js',
        'Modules/Common/YH.js',
        '../webMT/js/cwf.js',
        '../webMT/js/client.js',
        //'mt.js',
        'FileCommon.js',
        'Modules/YHFlexPaper/js/swfobject/swfobject.js',
        'Reference/bootstrap.js',
        'Reference/jQuery/livequery.js',
        'Reference/jQuery/JQueryUi_bs/jquery-ui-1.9.2.custom.min.js',
        'Reference/Common/raphael-min.js',
        'Modules/jquery.yinhoo.js',
        'Reference/jQuery/jquery.cookie.js',
        'Modules/Common/jquery.bgiframe.js',
        'Modules/Common/popbox.js',
        'Modules/Common/CommonFunc.js',
        'Modules/Common/SelectUsers.js',
        'Modules/Common/Yinhoo.SelelctTree.js',
        'Modules/Common/EditTable.js',
        'Modules/planworktask/pwt.js',
        'Reference/jQuery/Alerts/jquery.hiAlerts-min.js',
        'Modules/Common/scrollpic.js',
        'Modules/Common/imgSwitch.js',
        'Reference/myFocus/js/myfocus-1.2.0.full.js',
        'Reference/thinkBox/js/jquery.lightbox-0.5.js',
        'Reference/highslide/highslide-with-gallery.js',
        'Modules/Common/jquery.YH-superTables.js',
        'Projects/ZY/ueditor.config.js',
        'Reference/Ueditor/ueditor1_4_3-utf8-net/ueditor.all.min.js'
    ]).pipe(concat('zy.bundle.js'))
    .pipe(uglify({
    	compress:{
    		properties : false
    	}
    }))
    .pipe(gulp.dest('bundle/'));
});

gulp.task('default',function(){
    gulp.start('minifyjs_zy');
});

