/**
 * Created by Administrator on 2016/8/18.
 */
Vue.filter('http',function(){
    var val=arguments[0];
    if(/^http:\/\//.test(val)){
        return val;
    }else{
        return "http:\/\/"+val;
    }
});
Vue.filter('root',function(val){
    if(/^http:\/\//.test(val)){
        return val;
    }else if(eval("\/"+oUserinfo.addr.root+"\/").text(val)){
        return "http:\/\/"+val;
    }else{
        return "http:\/\/"+oUserinfo.addr.root+val;
    }
});
Vue.filter('date',function(val){
    if(isNaN(val)){return val;}
    return Util.getLocalTime(val,'-',false);
});
Vue.filter('trim',{
    read:function(val){
        return !val?'':val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    },
    write:function(val){
        return !val?'':val.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }
});