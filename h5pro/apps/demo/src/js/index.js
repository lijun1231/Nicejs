//创建时间：2016年4月26日 15:38:34
//创建人：李君
//说明：community
Nice.noConflict().useKey('__');//让出_，并用__作为替代关键字
var oUserinfo={
    wid:__.lib.getUrlval("wid")||"ctb_love",
    openid:__.lib.getUrlval("openid")||"love_chetuobang_forever_543720",
    uid:__.lib.getUrlval("uid")||"love_chetuobang_forever_1314",
    unid:__.lib.getUrlval("unid")||"love_chetuobang",
    from:__.lib.getUrlval("from")||null
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
var catalogRoot=location.href.substring(0,location.href.lastIndexOf("/"+j_m.oVersion.name+"/")+j_m.oVersion.name.length+1);//项目目录
var cpViewpoint = document.getElementById("cpViewpoint");
var shareTitle="车托帮 | 车主社区！";
var shareDesc="车托帮 | 车主社区 每天都要来哦！";
$(function(){
    //-------------------------
    //pub
    !function(){
        //根据属性自动添加埋点
        $(document).on("click","[data-maidian-key]",function(){
            Util.maiDian({key:$(this).attr("data-maidian-key").trim()});
        });
        //页面滚动
        $(window).scroll(function(){
            oDocinfo.t=document.body.scrollTop||document.documentElement.scrollTop;
        });
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
        __.lib.clearAllCookies();
        __.lib.responsiveScaling();
        Util.landscapeTip(true);//横屏提示
        wxSdkApply();//微信sdk
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
        j_m.extend("main","车友社区",function(cc){
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
            //轮播话题
            var mySwiper = new Swiper($slider,{
                pagination : '.swiper-pagination',
                loop:true,
                slidesPerView : 4,
                centeredSlides : true,
                observe:true
            });
            //点赞
            $starCond.each(function(){
                var _t=this;
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(_t,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(_t,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        },{
            style:['css/main1.css','css/main2.css'],
            js:['js/main.js','js/es6_test.js']
        });
        j_m.extend("list",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-posts-cond").children();
            //点赞
            $starCond.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        });
        j_m.extend("reply",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-rep-cond").children();
            Nice.addClass($page[0],'ready');
            //点赞
            $starCond.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        });
        j_m.extend("pdt",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCondP=$page.find(".comm-posts-cond").children();
            var $starCondR=$page.find(".comm-rep-cond").children();
            Nice.addClass($page[0],'ready');
            //帖子点赞
            $starCondP.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            //评论点赞
            $starCondR.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        });
        j_m.extend("rdt",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-rep-cond").children();
            Nice.addClass($page[0],'ready');
            //点赞
            $starCond.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        });
        j_m.extend("lst",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-posts-cond").children();
            Nice.addClass($page[0],'ready');
            //点赞
            $starCond.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        });
        j_m.extend("un_gen",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-posts-cond").children();
            Nice.addClass($page[0],'ready');
            //点赞
            $starCond.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        });
        j_m.extend("un_car",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-posts-cond").children();
            var $btCar=$page.find("#un_car-hd-tit-bt");
            var $hdTit=$page.find(".un_car-hd-tit");
            var $titPic=$hdTit.children(".un_car-hd-tit-pic").children("img");
            var $titCar=$hdTit.children(".un_car-hd-tit-tip").children("em");
            Nice.addClass($page[0],'ready');
            //点赞
            $starCond.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            //选择车型
            if(j_m.cateHash['selCar']==='1'){
                chooseCar.call($btCar[0],function(data){
                    console.log(data);
                    $titPic.attr("src",data.brandpic);
                    $titCar.text(data.brandname+" "+data.typename);
                    j_m.changeHash("un_car");
                });
            }else{
                chooseCar.call($btCar[0],"close");
            }
            $btCar.on("click",function(){
                j_m.changeHash("un_car/selCar=1");
            });
            cc();//页面渲染
        });
        j_m.extend("fr",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-fr-cond").children();
            Nice.addClass($page[0],'ready');
            //点赞
            $starCond.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }
            });
            cc();//页面渲染
        });
        j_m.extend("car",function(cc){
            var $page=$(j_m.currPage[0]);
            Nice.addClass($page[0],'ready');
            $page.find("#inp-car").on("click",function(){

            });
            $page.find("#inp-reg").on("click",function(){

            });
            $btCar=$page.find("#change-car-bt");
            $titCar=$page.find($btCar).parent();
            //选择车型
            if(j_m.cateHash['selCar']==='1'){
                chooseCar.call($btCar[0],function(data){
                    $titPic.attr("src",data.brandpic);
                    $titCar.text(data.brandname+" "+data.typename);
                    j_m.changeHash("un_car");
                });
            }else{
                chooseCar.call($btCar[0],"close");
            }
            $btCar.on("click",function(){
                j_m.changeHash("un_car/selCar=1");
            });
            cc();//页面渲染
        });
        j_m.extend("user",function(cc){
            var $page=$(j_m.currPage[0]);
            $btCar=$page.find("#user-info-sel-car");
            $birTime=$page.find("#birthday");
            Nice.addClass($page[0],'ready');
            //选择生日
            selDateTimeRange({
                y:2008,
                m:1,
                d:1
            },{
                y:1970,
                m:1,
                d:1
            },{
                y:new Date().getFullYear(),
                m:new Date().getMonth()+1,
                d:new Date().getDate()
            },$birTime,function(data){
            });
            //选择车型
            if(j_m.cateHash['selCar']==='1'){
                chooseCar.call($btCar[0],function(data){
                    $titPic.attr("src",data.brandpic);
                    $titCar.text(data.brandname+" "+data.typename);
                    j_m.changeHash("un_car");
                });
            }else{
                chooseCar.call($btCar[0],"close");
            }
            $btCar.on("click",function(){
                j_m.changeHash("un_car/selCar=1");
            });
            cc();//页面渲染
        });
        j_m.extend("fdt",function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCondP=$page.find(".comm-fdt-cond").children();
            var $starCondR=$page.find(".comm-fr-cond").children();
            var $inpRep=$page.find("#fdt-rep-inp");
            Nice.addClass($page[0],'ready');
            //帖子点赞
            $starCondP.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }else if($(this).index()===1){
                    $(this).on("click",function(){
                        j_m.changeHash("fdt/input=rep");//回复评论
                    });
                }
            });
            //评论点赞
            $starCondR.each(function(){
                if($(this).index()===0){
                    if(!$(this).hasClass("on")){
                        //点赞
                        $(this).on("click",function(){
                            praiseUp(this,true);
                        });
                    }else{
                        //取消赞
                        $(this).on("click",function(){
                            praiseUp(this,false);
                        });
                    }
                }else if($(this).index()===1){
                    $(this).on("click",function(){
                        j_m.changeHash("fdt/input=back");//回复评论
                    });
                }
            });
            //回复楼主
            if(j_m.cateHash['input']==="rep"){
                replyText({
                    type:"open",
                    cap:"请输入评论内容：",
                    focus:true,
                    callback:function(data){
                        j_m.changeHash("fdt");
                    }
                });
            }else if(j_m.cateHash['input']==="back"){
                replyText({
                    type:"open",
                    cap:"请输入回复内容：",
                    callback:function(data){
                        j_m.changeHash("fdt");
                    }
                });
            }else{
                replyText("close");
            }
            $inpRep.on("touchend",function(){
                j_m.changeHash("fdt/input=rep");
            });
            cc();//页面渲染
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
//点赞
function praiseUp(ele,type){
    var $_this=$(ele);
    var ind;
    $_this.off("click");
    ind=$_this.closest("[data-id]").attr("data-id");
    $star=$_this.children(".icon");
    if(type){
        $_this.addClass("on");
        $star.removeClass("icon-18").addClass("icon-19");
        $_this.on("click",function(){
            praiseUp(ele,false);
        });
    }else{
        $_this.removeClass("on");
        $star.removeClass("icon-19").addClass("icon-18");
        $_this.on("click",function(){
            praiseUp(ele,true);
        });
    }
}
//微信分享
function wxSdkApply(){
    var wx=wx||null;if(!wx){return;}
    var appId,timestamp,nonceStr,signature;
    var urlWXShare="http_weixintoken.php?url="+Base64.base64_encode(window.location.href.trim());
    //var shareURL=location.href.split("?")[0]+"?openid="+oUserinfo.openid+"&uid="+oUserinfo.uid+"&wid="+oUserinfo.wid+"#login";//分享链接
    var shareURL=location.href.split("?")[0]+"?#login";//分享链接
    //ajax
    Util.callService({
        unlock:true,
        url: urlWXShare,
        type: "post",
        paras: {},
        callback: function (data) {
            if (data) {
                appId = data.appId;
                timestamp = data.timestamp;
                nonceStr = data.nonceStr;
                signature = data.signature;
                wx.config({
                    debug: false,
                    appId: appId,
                    timestamp: timestamp,
                    nonceStr: nonceStr,
                    signature: signature,
                    jsApiList: ["onMenuShareTimeline", "onMenuShareAppMessage"]
                });
            }
        }
    });
    function onWeiXinReady(){
        wx.hideOptionMenu();
        //wx.hideMenuItems({
        //    menuList: [
        //        'menuItem:readMode', // 阅读模式
        //        'menuItem:share:timeline', // 分享到朋友圈
        //        'menuItem:copyUrl' // 复制链接
        //    ],
        //    success: function (res) {
        //        alert('已隐藏 阅读模式 分享到朋友圈 复制链接 等按钮');
        //    },
        //    fail: function (res) {
        //        alert(JSON.stringify(res));
        //    }
        //});
        //分享给朋友
        return;
        wx.onMenuShareAppMessage({
            title:shareTitle,
            desc: shareDesc,
            link:shareURL,
            imgUrl: catalogRoot+"/images/share_icon.png?v="+j_m.oVersion.v,
            type: 'link',
            dataUrl: '',
            success: function(){
            },
            cancel: function(){
            }
        });
        //分享到朋友圈
        wx.onMenuShareTimeline({
            title:shareDesc,
            link:shareURL,
            imgUrl: catalogRoot+"/images/share_icon.png?v="+j_m.oVersion.v,
            success: function () {
            },
            cancel: function () {
            }
        });
    }
    wx.ready(onWeiXinReady);

    wx.error(function(res){
    });
}

function getLocalTime(nS,t,hasTime) {
    var t=t||".";
    var dt=new Date(parseInt(nS) * 1000);
    var m=dt.getMonth()+1;
    m=(m+"").length<2?"0"+m:m;
    var d=dt.getDate();
    d=(d+"").length<2?"0"+d:d;
    var hasTime=hasTime===false?hasTime:true;
    var h=dt.getHours().toString();
    h=h.length==2?h:"0"+h;
    var mn=dt.getMinutes().toString();
    mn=mn.length==2?mn:"0"+mn;
    var s=dt.getSeconds().toString();
    s=s.length==2?s:"0"+s;
    if(hasTime){
        return dt.getFullYear()+t+m+t+d+" "+h+":"+mn+":"+s;
    }else{
        return dt.getFullYear()+t+m+t+d;
    }
}
//获取当前城市
function getCurrCity(fn){
    //实例化城市查询类
    AMap.service(["AMap.CitySearch"], function() { //加载地理编码
        var citysearch = new AMap.CitySearch();
        //自动获取用户IP，返回当前城市
        citysearch.getLocalCity(function(status, result) {
            if (result && result.city && result.bounds) {
                fn(result);
            }
        });
    });
}
//根据车牌号获取城市名称
function getCityByPlat(p,fn){
    Util.callService({
        url: j_m.oVersion.addr.interface + "/index.php?d=v2_violate_info&c=v2_violate_info&m=get_city",
        type: "post",
        paras: {plate: p},
        callback: function (data) {
            if (data) {
                if (+data.code === 200) {
                    fn(data.msg);
                }
            }
        }
    });
}

//选择车型
function chooseCar(){
    var $page=$(j_m.currPage[0]);
    if(arguments.length!=0&&arguments[0]==="close"){
        $page.find("#car-type").hide();
        $page.find("#car-brand").hide();
        $page.find("#car-nav").hide();
        return;
    }
    var fn=arguments.length!=0&&typeof arguments[arguments.length-1]==="function"?arguments[arguments.length-1]:null;
    var ev=window.event||arguments.callee.arguments[0].caller;
    var target=(function(){
        var t=ev.target||ev.srcElement;
        if(t.nodeType&&t.nodeType===1){
            return t;
        }else{
            return this==window||this==document?$("body"):this;
        }
    }).call(this);
    if(!$page.find("#car-brand-box").length){
        var $box=$('<div id="car-brand-box"></div>').appendTo($page);
        j_m.loadPage("lib_car",function(data){
            $box.html(data);
            setCarList({
                grade:"brand",
                tar:target
            },fn);
        });
    }else{
        setCarList({
            grade:"brand",
            tar:target
        },fn);
    }
}
function setCarList(o,fn){
    var $page=$(j_m.currPage[0]);
    switch(o.grade){
        case "brand":
            //数据填充
            if(!localStorage.car){
                loadCarList(iniList);
            }else{
                iniList();
            }
            break;
        case "type":
            //数据填充
            var arr=JSON.parse(localStorage.car);
            var $listType=$page.find("#car-type");
            $listType.empty();
            $listType.show();
            for(var i= 0,len=arr.length;i<len;i++){
                if(arr[i].id== o.brandid){
                    var sub=arr[i].sub;
                    for(var i= 0,lens=sub.length;i<lens;i++){
                        if(!sub[i].sub||sub[i].sub.length==0){
                            //o.tar.setAttribute("value",o.str);
                            //o.str=
                            var subs=sub;
                        }else{
                            $listType.append("<p>"+sub[i].name+"</p>");
                            var subs=sub[i].sub;
                        }
                        for(var j= 0,lensi=subs.length;j<lensi;j++){
                            $listType.append("<li data-typeid='"+subs[j].id+"' code='"+subs[j].code+"'><img src='"+subs[j].pic+"'>"+subs[j].name+"</li>");
                        }
                    }
                    break;
                }
            }
            //绑定事件
            $listType.children("li").off("click");
            $listType.children("li").each(function(){
                $(this).on("click",function(){
                    o.tar.setAttribute("data-brandid",o.brandid);
                    o.tar.removeAttribute("data-typeid");
                    o.str+=$(this).text().trim();
                    o.tar.setAttribute("data-typeid",$(this).attr("data-typeid"));
                    o.tar.setAttribute("value",o.str);
                    $page.find("#car-type").empty().hide();
                    $page.find("#car-brand").empty().hide();
                    o.typeid=$(this).attr("data-typeid");
                    o.typename=$(this).text().trim();
                    o.typepic=$(this).children("img").attr("src");
                    if(fn){
                        fn(o);
                    }
                });
            });
            break;
    }
    function iniList(){
        var arr=JSON.parse(localStorage.car);
        var $list=$page.find("#car-brand");
        $list.empty();
        $list.show();
        for(var i= 0,len=arr.length;i<len;i++){
            if(i==0||arr[i].code!=arr[i-1].code){
                $list.append("<p>"+arr[i].code+"</p>");
            }
            $list.append("<li data-brandid='"+arr[i].id+"' code='"+arr[i].code+"'><img src='"+arr[i].pic+"'>"+arr[i].name+"</li>");
        }
        //绑定事件
        $list.children("li").each(function(){
            $(this).on("click",function(){
                o.grade="type";
                o.str=$(this).text().trim();
                o.brandid=$(this).attr("data-brandid");
                o.brandname=$(this).text().trim();
                o.brandpic=$(this).children("img").attr("src");
                setCarList(o,fn);
            });
        });
    }
}
//输入文字
function replyText(o){
    var $page=$(j_m.currPage[0]);
    var $rep=$page.children(".comm-ret");
    if(typeof o==="string"&&o==="close"){
        $rep.remove();
        return;
    }else if(typeof o==="object"&&o.type==="open"){
        var fn=o.callback||null;
        if($rep.length===0){
            $rep=$("<div class='comm-ret'></div>").appendTo($page);
            $area=$("<textarea class='comm-ret-area' placeholder='"+(o.cap||'请输入文字：')+"'></textarea>").appendTo($rep);
        }
        if(o.focus!==false){
            //alert($area.length);
            $area[0].focus();
        }
        $rep.on("keydown",function(e){
            if(e.keyCode===13){
                if(fn){
                    fn($area.val());
                    $rep.remove();
                }
            }
        })
    }
}
//加载车型
function loadCarList(fn){
    Util.callService({
        url:"http://wxlk.chetuobang.com/web_weixinlukuang/index.php?d=pinche&c=car_sharing&m=ajax_get_car",
        type:"get",
        paras:{
        },
        callback:function(data){
            if(data&&+data.ret==200&&data.data.length!=0){
                localStorage.car=JSON.stringify(data.data);
                if(fn){
                    fn();
                }
            }
        }
    })
}




















