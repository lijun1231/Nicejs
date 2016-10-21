//创建时间：2016年4月26日 15:38:34
//创建人：李君
//说明：community
var oUserinfo={
    wid:Util.getUrlval("wid")||"ctb_love",
    openid:Util.getUrlval("openid")||"love_chetuobang_forever_543720",
    uid:Util.getUrlval("uid")||"love_chetuobang_forever_1314",
    unid:Util.getUrlval("unid")||"love_chetuobang",
    from:Util.getUrlval("from")||null
};
var oDocinfo={};
//初始化框架
var j_m=Nice.create();
//公用addr
j_m.oVersion.addr={
    'root':"http://wxlk.chetuobang.com",
    'interface':"http://192.168.100.83:9000",
    'wx_callback':"",
    'file':""
};
Nice.noConflict().useKey('__');//让出_，并用__作为替代关键字
$(function(){
    //-------------------------
    //pub
    !function(){
        if(window.orientation===0){
            $("body").height($(window).height());
        }
        //车型列表
        !function(){
            if(localStorage.car){
                return;
            }
            //loadCarList();//加载车型
        }();
        Util.landscapeTip(true);//横屏提示
        Util.responsiveScaling();
    }();
    //access
    !function(){
        //模块函数
        j_m.extend({
            id:"ccc",
            title:"测试页面ccc",
            preload:true,
            init:function(){},
            beforeShow:function(){},
            afterShow:function(cc){
                var $page=$(j_m.currPage[0]);
                cc();
            },
            beforeHide:function(){},
            afterHide:function(){},
            unload:function(){}
        });
        j_m.extend("main","首页",function(cc){
            var $page=$(j_m.currPage[0]);
            var $slider=$page.find('#main-hd-list-slider');
            var $starCond=$page.find(".comm-posts-cond").children();
            var _=__;
            _.addClass($page[0],'ready');
            _.ajax({
                url:j_m.oVersion.addr.interface+"/front/forum/v1/forums?haha=1&bb=2",
                type:"get",
                dataType:"jsonp",
                paras:{
                    name:"lijun",
                    age:"111"
                },
                callback:function(data){
                    console.log(data);
                }
            });
            cc();//页面渲染
        },{
            style:['css/main1.css','css/main2.css'],
            js:['js/main.js']
        });
        //-------------------------
        j_m.extendBeforeRender(function(){
            console.log(":beforeRender");
        });
        //公共渲染——渲染前
        j_m.extendBeforeShow(function(t){
            console.log("compile preFn:beforeShow");
            var $page=$(t[0]);//当前页面
            $page.find("*").off("click touchstart touchend touchmove scroll focus blur change select load keydown resize");
            if(j_m.device.plat==="android"){
                wxSdkApply();//微信sdk
            }
        });
        //-------------------------
        //公有渲染——渲染后
        j_m.extendAfterShow(function(t){
            console.log("compile exFn:beforeShow");
            var page=t[0];//当前页面
            var $page=$(page);//当前页面
            ///////////////////////////////////////////////////////////-逻辑
            !function(){}();
            ///////////////////////////////////////////////////////////-样式
            //等宽高
            !function(){
                $page.find(".eq-wh").each(function(){
                    $(this).height($(this).width());
                });
                $page.find(".eq-hw").each(function(){
                    $(this).width($(this).height());
                });
            }();
            //宽高等比变化
            !function(){
                var $lstPic=$page.find(".responsive-ratio");
                var arrIn=[];
                $lstPic.each(function(i){
                    if($(this).attr("data-ratio")){
                        var ratio=$(this).attr("data-ratio").split('\/');
                        $(this).height(($(this).width()/ratio[0]*ratio[1]).toFixed(2));
                        arrIn[i]=ratio;
                    }else{
                        arrIn[i]=($(this).width()/$(this).height()).toFixed(2);
                    }
                });
                $(window).resize(function(){
                    $lstPic.each(function(){
                        $(this).height($(this).width()/arrIn[$(this).index()]);
                    });
                });
            }();
            //多行省略号
            //$(".figcaption").each(function(i){
            //    var divH = $(this).height();
            //    var $p = $("p", $(this)).eq(0);
            //    while ($p.outerHeight() > divH) {
            //        $p.text($p.text().replace(/(\s)*([a-zA-Z0-9]+|\W)(\.\.\.)?$/, "..."));
            //    };
            //});
            //设置itm中左右的宽高
            !function(){
                $page.find(".itm.auto").each(function(){
                    var $v=$(this);
                    var $l=$v.children(".itm-tit").css("width","auto");
                    $v.children(".itm-sub").css('marginLeft',$l.width());
                });
            }();
            //textarea自动变高
            !function(){
                $page.find("textarea.area.auto").each(function(){
                    var $v=$(this);
                    $v.on("keyup",function(){
                        $(this).css("height",this.scrollHeight);
                    }).trigger('keyup');
                });
            }();
        });
        // j_m.iniPages();
    }();
});
//非空检测
function isFormatedForNull(){
    var $fnull=$(j_m.currPage[0]).find("[data-format-null]");
    for(var i= 0,len=$fnull.length;i<len;i++){
        var $this=$fnull.eq(i);
        if($this.val().trim()==""){
            ErrorAlert($this.attr("data-format-null"));
            return false;
        }
    }
    return true;
}


















