/**
 * Created by Administrator on 2016/7/19.
 */
var express = require('express');
var app = express();
var server = app.listen(3000, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('app listening at http://%s:%s', host, port);
});
app.all('*',function(req,res,next){
    res.header("Access-Control-Allow-Origin", "http://192.168.101.7");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("X-Powered-By",' 3.2.1');
    res.header("Content-Type", "application/json;charset=utf-8");
    next();
});
app.get('/', function (req, res,next) {
    var paras=req.query;
    console.log(paras);
    //console.log(req.url);
    //console.log(para);
    //res.download('/service/app.js');
    paras.status='ok';
    res.json(paras);
    //res.redirect('www.baidu.com');
});
app.post('/', function (req, res) {
    var paras=req.query;
    paras.status='ok';
    res.redirect('http://www.baidu.com');
    res.json(paras);
});