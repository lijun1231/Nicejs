/**
 * Created by Administrator on 2016/9/18.
 */
var lib=require('../create/lib.js');
var Crawler = require("crawler");
var jsdom = require('jsdom');
var http=require('http');
var request = require('request');
var arrUrls=[];
var c = new Crawler({
    jQuery: jsdom,
    maxConnections : 100,
    forceUTF8:true,
    // incomingEncoding: 'gb2312',
    // This will be called for each crawled page
    callback : function (error, result, $) {
        var urls = $('#list a');
        (function(i){
            var cb=arguments.callee;
            if(i<urls.length){
                var v=urls.eq(i);
                var o={
                    index:i,
                    title:v.text(),
                    url:v.attr('href')
                };
                o.num=o.url.replace('\.html','');
                arrUrls.push(o);
                //if(i>1){return;}
                request.post({
                    url:'http://localhost:8081/crawler/user/v1/insertUrls',
                    form:o
                },function(err,res,body){
                    console.log(body)
                });
                //lib.callService({
                //    url:'localhost',
                //    interface:'insurls',
                //    paras:o,
                //    callback:function(data){
                //        console.log(11111111111);
                //        console.log(data);
                //    }
                //});
                cb(i+1);
            }else{
                lib.setFileContent('../out/urls.json',JSON.stringify(arrUrls),function(data){
                    console.log('更新urls.json成功');
                });
                return;
            }
        })(0);
    }
});
//抓取页面
c.queue('http://www.biquku.com/0/330/');
//调用外部接口
var resData='';
//lib.callService({
//    url:'localhost',
//    interface:'persons',
//    paras:{
//        id:1
//    },
//    callback:function(data){
//        //console.log(data);
//    }
//});
//lib.callService({
//    url:'localhost:8081',
//    interface:'test',
//    paras:{
//        title:'aaa',
//        num:111,
//        url:'111.html'
//    },
//    callback:function(data){
//        console.log(data);
//    }
//});