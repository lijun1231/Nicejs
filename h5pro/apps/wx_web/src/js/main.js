//创建时间：2016年8月15日 09:13:57
//创建人：李君
//说明：首页
!function(){
    var me=j_m.currPage;
    me.hook(function(page) {
        var vm = me.vm;
        var $page=$(page[0]);
        var $slider1=$page.find('#main-hd-list-slider');
        var $slider2=$page.find('#header-swiper');
        if (!vm) {
            vm=me.vm=new Vue({
                el:$page[0],
                data:{
                    list:[],
                    pList:[],
                    atags:[],
                    query_tag_id:j_m.cateHash['tag_id'],
                    hd:{},
                    hdl:[],
                    nav:{
                        mod:0,
                        order:false
                    },
                    order_by:0,
                    keyword:'',
                    hasMore:true,
                    pageIndex:1,
                    end:false
                },
                ready:function(){
                    Junb.addClass(me[0],'ready');
                    j_m.compilePage();
                            setTimeout(function(){
                        j_m.compilePage();
                    },100);
                },
                methods:{
                    search:function(){
                        j_m.changeHash('list/keyword='+encodeURIComponent(vm.keyword.trim()));
                    },
                    switchNav:function(mod){
                        vm.keyword='';
                        vm.nav.mod=mod;
                    },
                    togOrder:function(){
                        vm.nav.order=!vm.nav.order;
                    },
                    orderBy:function(e){
                        var order=$(e.target).attr('data-order');
                        console.log(order);
                        vm.order_by=order;
                        vm.nav.order=false;
                    },
                    loadVideoList:function(){
                        vm.pageIndex++;
                        Util.callService({
                            url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=getVideoList",
                            type:"post",
                            paras:{
                                p:vm.pageIndex,
                                n:"4",
                                tag_id:vm.query_tag_id
                            },
                            callback:function(data){
                                if(data.data.length!=0){
                                    if(vm.pageIndex==1){
                                        vm.list=data.data.slice(5);
                                    }
                                    vm.list=me.vm.list.concat(data.data);
                                    setTimeout(function(){
                                        j_m.compilePage();
                                        oDocinfo.sh=document.documentElement.scrollHeight;
                                        $(window).on("scroll",vm.loadByScroll);
                                    });
                                }else{
                                    vm.hasMore=false;
                                }
                            }
                        });
                    },
                    loadByScroll:function(){
                        if(!j_m.cateHash.usr&&Util.isPageEnd()){
                            vm.end=true;
                            $(window).off("scroll",vm.loadByScroll);
                            vm.loadVideoList();
                        }
                    }
                }
            });
            var $header=$page.find("#main-header");
            setTimeout(function(){
                $('body').scrollTop($header.height());
                $header.show();
                //标签轮播
                var mySwiper2 = new Swiper($slider2,{
                    //pagination : '.swiper-pagination',
                    loop:false,
                    autoplay:false,
                    speed:1000,
                    slidesPerView : 5,
                    centeredSlides : false,
                    observer:true
                });
            },500);
            //视频列表
            vm.loadVideoList();
        }else{
            vm.query_tag_id=j_m.cateHash['tag_id'];
            vm.nav.mod=0;
            vm.nav.order=false;
            //置空、回复默认值
            vm.list=null;
            vm.hasMore=true;
            vm.pageIndex=0;
            vm.loadVideoList();
        }
        //标签
        Util.callService({
            url: oUserinfo.addr.interface + "/index.php?d=account&c=video&m=getTags",
            paras: {
                video_id: j_m.cateHash.video_id
            },
            callback: function (data) {
                me.vm.atags=data.data;
                me.vm.cc=data.data.cc;
            }
        });
        //视频推荐
        Util.callService({
            url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=getVideoList",
            type:"post",
            paras:{
                p:"1",
                n:"5"
            },
            callback:function(data){
                me.vm.pList=data.data;
                me.vm.hd=me.vm.pList[0];
                me.vm.hdl=me.vm.pList.slice(1,5);
                setTimeout(function(){
                    j_m.compilePage();
                });
            }
        });
        //个人中心的打开和关闭
        !function(){
            var $bt=$('#j-footer-to');
            setTimeout(function(){
                if(j_m.cateHash['usr']){
                    $bt.attr('data-href','\-usr');
                    $bt.addClass('on');
                }
            });
            $bt.click(function(e){
                if($(this).hasClass('on')){
                    $(this).attr('data-href','\-usr');
                    $(this).removeClass('on');
                }else{
                    $(this).attr('data-href','\^usr=u');
                    $(this).addClass('on');
                }
                Junb.drag($bt[0]);
                //e.stopPropagation();
            });
        }();
    });
}();