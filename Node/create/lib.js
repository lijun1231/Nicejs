/**
 * Created by Administrator on 2016/7/1.
 */
//两位数格式化
var fs = require('fs');
var url=require('url');
var http = require('http');
exports.formateNm = function (num) {
    return num < 10 ? "0" + num : '' + num;
};
//读文档
exports.getFileContent = function (src, fn) {
    var readStream = fs.createReadStream(src);
    var data = '';
    readStream.setEncoding('utf8');
    readStream.on('data', function (chunk) {
        data += chunk;
    });
    readStream.on('end', function () {
        !fn || fn(data);
    });
};
//写文档
exports.setFileContent = function (src, data, fn) {
    var writeStream = fs.createWriteStream(src);
    writeStream.write(data, 'UTF8', function () {
        writeStream.end();
    });
    writeStream.on('finish', function () {
        !fn || fn({status: 'ok', data: data});
    });
};
exports.callService=function(o){
    var paras=(()=>{
        let str='';
        if(o.paras){
            for(var v in o.paras){
                str+=v+'='+o.paras[v]+'&';
            }
        }
        str=str?str.substr(0,str.length-1):'';
        console.log(str);
        return str;
    })();
    var resData='';
    var req=http.request({
        host:o.url.split(':')[0],
        port:o.url.split(':')[1]||'8081',
        method:'POST',
        path:'/'+o.interface+'?'+(paras),
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Content-Length': Buffer.byteLength(paras)
        }
    },function(res){
        res.on('data',function(d){
            resData += d;
        }).on('end', function(){
            o.callback(resData);
        });
    }).on('error', function(e) {
        console.log("Got error: " + e.message);
    });
    req.end();
}