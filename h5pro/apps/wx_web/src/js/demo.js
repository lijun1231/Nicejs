//创建时间：2016年8月15日 09:13:57
//创建人：李君
//说明：首页
!function(){
    var $page=$(j_m.currPage[0]);
    var me=j_m.currPage;
    me.hook(function(){
        var vm=me.vm;
        if(!vm){
            vm=me.vm=new Vue({
                el:$page[0],
                data:{
                    v:{},
                    hash:j_m.cateHash,
                    name:''
                },
                created:function(){
                    console.log("created");
                },
                beforeCompile:function(){
                    console.log("beforeCompile");
                },
                compiled:function(){
                    console.log("compiled");
                },
                update:function(){
                    console.log("update");
                },
                ready:function(){
                    Junb.addClass(me[0],'ready');
                    j_m.compilePage();
                },
                methods:{
                }
            });
        }else{
            vm.hash=j_m.cateHash;
        }
    });
}();