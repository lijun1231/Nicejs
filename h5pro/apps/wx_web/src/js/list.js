//创建时间：2016年8月15日 09:13:57
//创建人：李君
//说明：首页
!function(){
    var me=j_m.currPage;
    me.hook(function() {
        var vm = me.vm;
        var $page=$(j_m.currPage[0]);
        if (!vm) {
            vm=me.vm=new Vue({
                el:$page[0],
                data:{
                    list:[],
                    keyword:decodeURIComponent(j_m.cateHash['keyword'])
                },
                ready:function(){
                    Junb.addClass(me[0],'ready');
                    j_m.compilePage();
                    setTimeout(function(){
                        j_m.compilePage();
                    },100);
                }
            });
        }else{
            vm.keyword=decodeURIComponent(j_m.cateHash['keyword'])
        }
        //搜索列表
        Util.callService({
            url: oUserinfo.addr.interface + "/index.php?d=account&c=Video&m=search",
            paras: {
                keyword: vm.keyword,
                p:1,
                n:10
            },
            callback: function (data) {
                if(data){
                    if(data.data){
                        if(data.errcode==0){
                            me.vm.list=data.data.pass;
                        }else{
                            me.vm.list=null;
                            Util.Alert('没有搜索到相关视频~');
                        }
                    }
                }
                setTimeout(function(){
                    j_m.compilePage();
                });
            }
        });
    });
}();