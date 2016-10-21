/**
 * Created by Administrator on 2016/10/10.
 */
require.config({
    baseUrl:'./js',
    paths:{
        "lib":'Nice.lib-1.0.0'
    },
    shim:{
        Nice:{
            exports:"_"
        },
        lib:{
            deps:["Nice"],
            exports:"_lib"
        }
    }
});
require(["Nice","lib"],function(){
    console.log(arguments);
});
require(['xxx.js'],function(dt){
    
});