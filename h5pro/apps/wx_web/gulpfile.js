//导入工具包 require
var gulp = require('gulp'),
    del = require('del'),
    events = require('events'),
    emitter = new events.EventEmitter(),
    moment = require('moment'),
    fs=require('fs'),
    lib = require('./create/gulpfile_lib'),
    formateNm=lib.formateNm,
    argv = require('minimist')(process.argv.slice(2)),
    minifycss = require('gulp-minify-css'),
    autoprefixer=require('gulp-autoprefixer'),
    livereload=require('gulp-livereload'),
    less = require('gulp-less'),
    jshint = require('gulp-jshint'),
    concat = require('gulp-concat'),
    dest = require('gulp-dest'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    imagemin = require('gulp-imagemin'),
    cache = require('gulp-cache'),
    notify = require('gulp-notify'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    useref=require('gulp-useref'),
    rev = require('gulp-rev'),
    revCollector = require('gulp-rev-collector'),
    minifyhtml = require('gulp-minify-html'),
    gulpignore=require('gulp-ignore'),
    filter = require('gulp-filter'),
    assetManifest=require('gulp-asset-manifest'),
    flatten=require('gulp-flatten'),
    clean=require('gulp-clean'),
    runSequence = require('gulp-sequence'),
    plumber = require('gulp-plumber'),//防止因为报错而中止watch的实时监听
    watch = require('gulp-watch'),
    zip = require('gulp-zip'),
    gulp_remove_logging=require("gulp-remove-logging");
var taskVersion="",//备份版本号
    projectName=__dirname.substr(__dirname.lastIndexOf('\\')+1);//项目名称

/////////////////////////////////////////////构建demo
var paths={};
paths.src='./src';
paths.server='./server';
paths.history='./history';
paths.input={
    js:{
        base:paths.src+'\/',
        catalog:['js','components','filters','directive']
    },
    css:{
        base:paths.src+'\/',
        catalog:['css']
    },
    images:{
        base:paths.src+'\/',
        catalog:['images']
    },
    views:paths.src+'/views',
    less:paths.src+'/less',
    coffee:paths.src+'/coffee',
    pages:paths.src
};
paths.output={
    js:{
        base:paths.server+'\/'
    },
    css:{
        base:paths.server+'\/'
    },
    images:{
        base:paths.server+'\/'
    },
    views:paths.server+'/views',
    pages:paths.server
};

//task-help
gulp.task('help',function(){
    console.log('--------------注释---------------------------');
    console.log('gulp less           less编译： src/less/=>src/css，后缀由 -.less变为 -.less.css');
    console.log('gulp compile:css    构建css');
    console.log('gulp compile:js     构建js');
    console.log('gulp compile:images 构建images');
    console.log('gulp compile:rev    构建pages——包含html、php');
    console.log('gulp backup         备份最新版本');
    console.log('gulp build          一键构建，包含backup,less,clean:dev,compile:css,compile:js,compile:images,compile:rev');
    console.log('gulp build:junb     (Junb框架专属)一键构建，包含backup,less,clean:dev,compile:css,compile:js,compile:images,compile:views,compile:rev,compile:rev-views');
    console.log('gulp compress       压缩到 项目名+zip');
    console.log('gulp back           回退到上最近的一个版本');
    console.log('gulp back --v xxxx  回退到某一特定版本xxxx代表版本号');
    console.log('gulp watch:less     less实时编译');
    console.log('gulp watch:lp       浏览器实时刷新');
    console.log('gulp watch          less实时编译且浏览器实时刷新');
    console.log('--------------注释---------------------------');
});
////////////////////////////////////////////////////////////
(function(){
    var srcBase=paths.input.css.base;
    var serverBase=paths.output.css.base;
    var ct=paths.input.css.catalog;
    var tasks=[];
    var lessTasks=[];
    for(var i=0;i<ct.length;i++){
        tasks.push('compile:css_'+ct[i]);
        !function(i){
            gulp.task(tasks[i],function(){
                return gulp.src(srcBase+ct[i]+'/*.css')
                    //添加前缀
                    .pipe(autoprefixer({
                        browser:['last 2 version', 'safari 5', 'ie 8', 'ie 9', 'opera 12.1', 'ios 6', 'android 4'],
                        cascade:true,
                        remove:false
                    }))
                    //压缩、md5加密并输出到目录
                    .pipe(minifycss())
                    .pipe(rev())
                    .pipe(gulp.dest(serverBase+ct[i]))
                    //生成rev-manifest.json并输出到目录
                    .pipe(rev.manifest())
                    .pipe(gulp.dest(srcBase+ct[i]))
                    //提醒任务完成
                    .pipe(notify({ message: 'css_'+ct[i]+'_compile task complete' }));
            });
        }(i);
    }
    gulp.task('compile:css',function(cb){
        return runSequence(tasks,cb);
    });
    gulp.task('less',function(){
        gulp.src(paths.input.less+'/*.less').doLess(srcBase+ct[0]);//less默认的输出目录是css目录的第一个
    });
})();
(function(){
    var srcBase=paths.input.js.base;
    var serverBase=paths.output.js.base;
    var ct=paths.input.js.catalog;
    var tasks=[];
    for(var i=0;i<ct.length;i++){
        tasks.push('compile:js_'+ct[i]);
        !function(i){
            gulp.task(tasks[i],function(){
                return gulp.src(srcBase+ct[i]+'/*.js')
                    .pipe(jshint.reporter('default'))
                    .pipe(gulp_remove_logging())
                    //压缩、md5加密并输出到目录
                    .pipe(uglify())
                    .pipe(rev())
                    .pipe(gulp.dest(serverBase+ct[i]))
                    //生成rev-manifest.json并输出到目录
                    .pipe(rev.manifest())
                    .pipe(gulp.dest(srcBase+ct[i]))
                    //提醒任务完成
                    .pipe(notify({ message: 'js_'+ct[i]+'_compile task complete' }));
            });
        }(i);
    }
    gulp.task('compile:js',function(cb){
        return runSequence(tasks,cb);
    });
})();
(function(){
    var srcBase=paths.input.images.base;
    var serverBase=paths.output.images.base;
    var ct=paths.input.images.catalog;
    var tasks=[];
    for(var i=0;i<ct.length;i++){
        tasks.push('compile:images_'+ct[i]);
        !function(i){
            gulp.task(tasks[i],function(){
                return gulp.src(srcBase+ct[i]+'/*.{png,jpg,gif,ico}')
                    .pipe(gulp.dest(serverBase+ct[i]))
                    .pipe(imagemin({//强制压缩
                        optimizationLevel: 1,
                        progressive: true,
                        interlaced: true ,
                        multipass: true
                    }))
                    .pipe(gulp.dest(serverBase+ct[i]))
                    //提醒任务完成
                    .pipe(notify({ message: 'images_'+ct[i]+'_compile task complete' }));
            });
        }(i);
    }
    gulp.task('compile:images',function(cb){
        return runSequence(tasks,cb);
    });
})();
gulp.task('compile:views',function(){
    return gulp.src(paths.input.views+'/*.html')
        //压缩、md5加密并输出到目录
        //压缩并输出到目录
        .pipe(minifyhtml())
        .pipe(rev())
        .pipe(gulp.dest(paths.output.views))
        //生成rev-manifest.json并输出到目录
        .pipe(rev.manifest())
        .pipe(gulp.dest(paths.input.views))
        //提醒任务完成
        .pipe(notify({ message: 'views_compile task complete' }));
});
gulp.task('compile:rev',function(){
    //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
    return gulp.src([paths.src+'/*/rev-manifest.json', paths.input.pages+'/*.html', paths.input.pages+'/*.php'])
        //- 执行文件内css名的替换
        .pipe(revCollector())
        //压缩并输出到目录
        .pipe(minifyhtml())
        .pipe(gulp.dest(paths.output.pages))
        //提醒任务完成
        .pipe(notify({ message: 'html_compile task complete' }));
});
gulp.task('compile:rev-views',function(){
    var cpJson={};
    var cpDt='';
    var p1=new Promise((resolve)=>{
        lib.getFileContent(paths.server+'/index.html',(dt)=>{
            cpDt=dt;
            resolve();
        });
    });
    var p2=new Promise((resolve)=>{
        lib.getFileContent(paths.src+'/views/rev-manifest.json',(dt)=>{
            cpJson.views=dt;
            resolve();
        });
    });
    var p3=new Promise((resolve)=>{
        lib.getFileContent(paths.src+'/js/rev-manifest.json',(dt)=>{
            cpJson.js=dt;
            resolve();
        });
    });
    var p4=new Promise((resolve)=>{
        lib.getFileContent(paths.src+'/css/rev-manifest.json',(dt)=>{
            cpJson.css=dt;
            resolve();
        });
    });
    Promise.all([p1,p2,p3,p4]).then(()=>{
        replaceServerHTML(cpDt.replace(/\n/g,''),cpJson,function(outData){
            lib.setFileContent(paths.server+'/index.html',outData,function(r){
                if(r&&r.status==="ok"){
                    //提醒任务完成
                    gulp.src('').pipe(notify({ message: 'html_views_compile task complete' }));
                }
            });
        });
    });
});
gulp.task('backup:res',function(){
    return gulp.src(paths.server+'/***/*.*')
        .pipe(gulp.dest(paths.history+'/'+taskVersion))
        .pipe(notify({message:'res_backup task complete'}));
});
gulp.task('backup:page',function(){
    return gulp.src(paths.server+'/*.*')
        .pipe(gulp.dest(paths.history+'/'+taskVersion))
        .pipe(notify({message:'page_backup task complete'}));
});
gulp.task('backup',function(cb){
    var dt=new Date();
    taskVersion=''+dt.getFullYear()+formateNm(dt.getMonth()+1)+formateNm(dt.getDate())+formateNm(dt.getHours())+formateNm(dt.getMinutes())+formateNm(dt.getSeconds());
    console.log('backup version:'+taskVersion);
    return runSequence('backup:res','backup:page',cb);
});
gulp.task('back',function(cb){
    fs.readdir(paths.history,function(err,data){
        if(data&&data.length!==0){
            var dt=data.sort();
            taskVersion=argv.v||dt[dt.length-1];
            return runSequence('clean:dev','resetVersion',cb);
        }else{
            console.log("there\'s no backup in directory "+paths.history);
            return;
        }
    });
});
gulp.task('resetVersion:res',function(){
    return gulp.src([paths.history+'/'+taskVersion+'/***/*.*'])
        .pipe(gulp.dest(paths.server))
        .pipe(notify({message:'res_back task complete'}));
});
gulp.task('resetVersion',['resetVersion:res'],function(){
    return gulp.src([paths.history+'/'+taskVersion+'/*.*'])
        .pipe(gulp.dest(paths.server))
        .pipe(notify({message:'page_back task complete'}));
});
gulp.task('clean:dev',function(){
    return gulp.src([paths.server+'/*'])
        .pipe(clean())
        .pipe(notify({message:'clean:dev task complete'}));
});
gulp.task('compress',function(){
    return gulp.src([paths.server+'/***/*.*',paths.server+'/*.*'])
        .pipe(zip(projectName+'.zip'))
        .pipe(gulp.dest('./'))
        .pipe(notify({message:'compress task complete'}));
});
gulp.task('build',     runSequence(['backup','less'],'clean:dev',['compile:css','compile:js','compile:images'],'compile:rev'));
gulp.task('build:junb',runSequence(['backup','less'],'clean:dev',['compile:css','compile:js','compile:images','compile:views'],'compile:rev','compile:rev-views'));
/////////////////////////////////////////////////////////////////////////////////watch
//监听-浏览器自动刷新
gulp.task('watch:lp',function() {
    livereload.listen();
    return gulp.watch([paths.src+'/*/*.*',paths.src+'/*.*'],function(file){
        livereload.changed(file.path);
    });
});
//监听-less自动编译
gulp.task('watch:less',function(){
    var p='';
    var srcBase=paths.input.css.base;
    var ct=paths.input.css.catalog;
    return watch(paths.input.less+'/*.less',function(file){
            return gulp.src(file.path)
                .pipe(plumber({errorHandler:notify.onError('error:<%= error.message %>')}))
                .pipe(less())
                .pipe(rename({suffix:'.less'}))
                .pipe(gulp.dest(srcBase+ct[0]))
                //回调
                .on('end',function(){
                    p=file.path.replace(/\.less$/,'.less.css');
                    livereload.changed(p);
                });
                //提醒任务完成
              //  .pipe(notify({ message: '1some less changed' }));
        });
});
//监听-es6自动编译
gulp.task('watch:es6',function(){
//    watch(paths.input.es6+'/*.js')
//        //提醒任务完成
//        .pipe(notify({ message: 'some es6 changed' }));
});
gulp.task('watch',['watch:less','watch:lp']);
/////////////////////////////////////////////////////////////////////////////////watch
/////////////////////////////////////////////////////////////////////////////////watch-2
//创建watch任务去检测html文件,其定义了当html改动之后，去调用一个Gulp的Task
gulp.task('live', function () {
    gulp.watch(['./src/**/*.*'], ['reload-res']);
});
gulp.task('reload-res', function () {
    gulp.src('./src/**/*.*')
        .pipe(connect.reload())
        .pipe(notify({message:'file reload'}));
});
//使用connect启动一个Web服务器
gulp.task('connect', function () {
    connect.server({
        root: './',
        livereload: true,
        port:80
    });
});
//测试服务器
gulp.task('default',['connect','live']);
/////////////////////////////////////////////////////////////////////////////////watch-2
/////////////////////////////////
gulp.task('test', function() {
    console.log(__dirname);
    gulp.src(paths.src+'/images*/*.*')
        .pipe(rev())
        .pipe(gulp.dest(paths.server+'/assets'))
        .pipe(notify({message:'test task complete'}));
});
/////////////////////////////////////////////////////////////////////////////////extends
//拓展stream流的less函数
!function(){
    gulp.src('').__proto__.doLess=function(out,cb){
        return this.pipe(plumber({errorHandler:notify.onError('error:<%= error.message %>')}))
            .pipe(less())
            .pipe(rename({suffix:'.less'}))
            .pipe(gulp.dest(out))
            //提醒任务完成
            .pipe(notify({ message: 'some less changed' }))
            //回调
            .on('end',function(){
                cb&&cb();
            });
    };
}();
//Junb构建md5加密-rev
function replaceServerHTML(dt,json,fn){
    var r=JSON.parse(JSON.stringify(json).replace(/\.html|\.txt|\.js|\.css|\s/gim,''));
    var str='';
    str+='<script id="__domRevManifest">';
    str+='var __domRevManifest={';
    str+='views:'+r.views+',';
    str+='js:'+r.js+',';
    str+='css:'+r.css;
    str+='}</script>';
    str=str.replace(/\n/g,'');
    var reg,outData;
    if(/__domRevManifest/.test(dt)){
        reg=/<script id=\"__domRevManifest\">+(.*?)<\/script>/im;
        outData=dt.replace(reg,str);
    }else{
        reg=/<\/head>/;
        outData=dt.replace(reg,str+'<\/head>');
    }
    fn(outData);
}