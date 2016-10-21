/**
 * Created by Administrator on 2016/7/1.
 */
//两位数格式化
var fs=require('fs');
exports.formateNm=function (num){
    return num<10?"0"+num:''+num;
};
//读文档
exports.getFileContent=function(src,fn){
    var readStream=fs.createReadStream(src);
    var data='';
    readStream.setEncoding('utf8');
    readStream.on('data',function(chunk){
        data+=chunk;
    });
    readStream.on('end',function(){
        !fn||fn(data);
    });
};
//写文档
exports.setFileContent=function(src,data,fn){
    var writeStream=fs.createWriteStream(src);
    writeStream.write(data,'UTF8',function(){
        writeStream.end();
    });
    writeStream.on('finish',function(){
        !fn||fn({status:'ok',data:data});
    });
};