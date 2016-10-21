/**
 * Created by Administrator on 2016/9/21.
 */
exports.getPool=function(){
    //接口池
    return {
        getArticalInfo:{
            type:'list',//返回值类型
                getSql:function(query,form){//sql语句
                return {
                    strSql:'select * from urls where id='+form.id
                }
            },
            filter:function(resData){//返回值处理
                return resData;
            }
        },
        insertUrls:{
            type:'list',//返回值类型
            getSql:function(query,form){//sql语句
                return {
                    strSql:'insert into urls (title,url,num) values(\''+form.title+'\',\''+form.url+'\',\''+form.num+'\')'
                }
            },
            filter:function(resData){//返回值处理
                return resData;
            }
        },
        insertDesc:{
            type:'list',//返回值类型
            getSql:function(query,form){//sql语句
                return {
                    strSql:'update urls set detail =\''+form.detail+'\' where id=\''+query.id+'\''
                }
            },
            filter:function(resData){//返回值处理
                return resData;
            }
        },
        testinsertDesc:{
            type:'list',//返回值类型
            getSql:function(query,form){//sql语句
                return {
                    strSql:'update urls set detail =\''+form.detail+'\' where id=\''+query.id+'\''
                }
            },
            filter:function(resData){//返回值处理
                return resData;
            }
        },
        getIds:{
            type:'list',//返回值类型
            getSql:function(query,form){//sql语句
                return {
                    strSql:'select id,num from urls'
                }
            },
            filter:function(resData){//返回值处理
                return resData;
            }
        }
    }
};