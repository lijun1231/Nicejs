//引入包
var lib=require('../create/lib.js');
var mysql = require('mysql');
var bodyParser = require("body-parser");
var express = require("express");
var querystring = require('querystring');
var app=express();
var fs=require("fs");
//创建服务器
var server = app.listen(8081, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log("应用实例，访问地址为 http://", host, port)

});
//链接数据库  
var __DATABASE = 'ljdb';
var client = mysql.createConnection({
    host:'localhost',
    user: 'root',  
    password: 'root',  
});  
client.connect();
client.query("use " + __DATABASE);
client.query('set names utf8');
//连接信息
var __CONN={
    app:app,
    server:server,
    client:client,
    database:__DATABASE
};
app.use(bodyParser.urlencoded({ extended: false }));//这一句非常非常关键！！！！！！！！！，当使用www-form-encoded方式post的时候必须要这一句
app.all('*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "http://192.168.101.7");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
//查询
app.get('/persons', function (req, res) {
        req.setEncoding("utf8");
        var paras=require('url').parse(req.url, true).query;
        var $id=paras.id;
        console.log(paras);
        var TEST_TABLE = 'persons';
        var strSql='SELECT * FROM '+TEST_TABLE+' where id='+$id;
        console.log(strSql);
        var result=[];
        client.query( strSql,function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }
            if(results){
                for(var i = 0; i < results.length; i++){
                    result.push(results[i]);
                }
            }
            res.end("{"+JSON.stringify(result)+"}");
        });
});
//查询
app.post('/persons', function (req, res) {
    req.setEncoding("utf8");
    var paras=require('url').parse(req.url, true).query;
    var $id=paras.id;
    console.log(paras);
    var TEST_TABLE = 'persons';
    var result=[];
    var strSql='SELECT * FROM '+TEST_TABLE+' where id='+$id;
    console.log(strSql);
    client.query( strSql,function(err, results, fields) {
        if (err) {
            throw err;
        }
        if(results){
            for(var i = 0; i < results.length; i++){
                result.push(results[i]);
            }
        }
        console.log(result);
        res.end("{"+JSON.stringify(result)+"}");
    });
});
//写入
app.post('/test', function (req, res) {
    req.setEncoding("utf8");
    var paras=require('url').parse(req.url, true).query;
    var $title=paras.title;
    var $url=paras.url;
    var $num=paras.num;
    var TEST_TABLE = 'urls';
    console.log(paras);
    var strSql='insert into '+TEST_TABLE+' (title,url,num) values(\''+$title+'\',\''+$url+'\',\''+$num+'\')';
    console.log(strSql);
    client.query(strSql,function(err,result){
        if(err){
            console.log(err);
            return;
        }
        console.log('-------INSERT----------');
        console.log(result);
        res.end(result);
    });
});
app.post('/insurls', function (req, res) {
    req.setEncoding("utf8");
    console.log('-------START insurls----------');
    var paras=req.body;
    console.log(paras);
    var $title=paras.title;
    var $url=paras.url;
    var $num=paras.num;
    var TEST_TABLE = 'urls';
    var strSql='insert into '+TEST_TABLE+' (title,url,num) values(\''+$title+'\',\''+$url+'\',\''+$num+'\')';
    console.log(strSql);
    client.query(strSql,function(err,result){
        if(err){
            console.log(err);
            return;
        }
        console.log('-------INSERT----------');
        console.log(result);
        res.end("data:{"+JSON.stringify(result)+"}");
    });
});
//接口监听
    //单一入口
var conduct=require('./conduct/conduct');
app.post('/crawler/:d/:c/:m',function(req, res){
    req.setEncoding("utf8");
    var params=req.params;
    var path='./controller/'+params.d+'/'+params.c;
    var pool=require(path).getPool();
    conduct(req,res,pool[params.m],__CONN);
});
