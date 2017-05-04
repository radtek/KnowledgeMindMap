var gulp = require('gulp');  
var cmdPack = require('gulp-cmd-pack');  
var uglify = require('gulp-uglify');  
   
gulp.task('default', function () {  
    gulp.src('./app/flowMap.v2.js') //main文件   
        .pipe(cmdPack({  
            mainId: 'flowMap', //初始化模块的id   
            base: './app', //base路径  
        }))  
       // .pipe(uglify())  
        .pipe(gulp.dest('dist/'));//输出到目录   
}); 