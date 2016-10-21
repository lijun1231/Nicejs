/**
 * Created by Administrator on 2016/9/21.
 */
module.exports=function(req, res,c,conn){
    var query=req.query;//url中的参数
    var params=req.params;//url中的路由参数
    var form=req.body;//post表单提交的参数
    var p=c.getSql(query,form);
    var client=conn.client;//connection
    c.data={};
    //console.log(p.strSql);//打印sql
    client.query(p.strSql,function(err,result,fields){
        if(err){
            throw err;
            return;
        }
        switch(c.type){
            case 'list':
                c.data=[];
                if(result&&result.length!==0){
                    for(let i=0;i<result.length;i++){
                        c.data.push(result[i]);
                    }
                    c.errcode=0;
                    c.errmsg='ok';
                }else{
                    c.errcode=2000;
                    c.errmsg='no data';
                }
                break;
            case 'obj':
                c.data=null;
                if(result&&result!=={}){
                    c.data=result;
                    c.errcode=0;
                    c.errmsg='ok';
                }
                break;
        }
        if(c.filter){
            c.filter(c.data);
        }
        //res.end(JSON.stringify({"errcode":c.errcode, "errmsg":c.errmsg, data:c.data}));
        res.end(JSON.stringify({"errcode":c.errcode, "errmsg":c.errmsg, data:c.data}));
    });
};