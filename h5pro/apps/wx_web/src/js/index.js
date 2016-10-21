//创建时间：2016年4月26日 15:38:34
//创建人：李君
//说明：入口
var oUserinfo;
var oDocinfo={};
var j_m;
var catalogRoot;//项目目录
var shareTitle="车托邦 | 车主社区！";
var shareDesc="车托邦 | 车主社区 每天都要来哦！";
var __paras__={};//公用变量对象
//Util.setCookie("secret","5b5912180a48d6f50bd0ba620e04cd61458ad1cee22c799758f079659372b1054ca59f3c0c6c6f27ae97371d4eda7678a0b28c4a5ad0477bed0679d5ee276fae");
Util.setCookie("secret",Util.getUrlval("secret")||"fb6e8db96d03aaa7f06e4d93640997e9a57ec495d339084a1707e02ede4aa9c68966657a740732db85cae873aca214f637f06fbaa4378381994df2c21c5d3e88");
!function(){
    //-------------------------
    //return;
    //oUserinfo
    oUserinfo={
        wid:Util.getUrlval("wid")||null,
        openid:Util.getUrlval("openid")||null,
        uid:Util.getUrlval("uid")||null,
        unid:Util.getUrlval("unid")||null,
        from:Util.getUrlval("from")||null,
        secret:Util.getCookie("secret"),
        test:Util.getUrlval('test')||null,//如果有test值，则不会进行埋点
        addr:{//公用addr
            'root':"http://www.sooneus.tv",
            'interface':"http://www.sooneus.tv/wechat_web",
            'wx_callback':"",
            'file':""
        }
    };
    //页面信息
    oDocinfo={
        ch:document.documentElement.clientHeight,
        st:document.body.scrollTop,
        sh:document.documentElement.scrollHeight
    };
    //页面滚动
    $(window).scroll(function(){
        oDocinfo.st=document.body.scrollTop;
    });
    //初始化框架
    j_m=new Junb({
        test:oUserinfo.test,
        beforeShow:function(t){},
        afterShow:function(t){}
    });
    catalogRoot=location.href.substring(0,location.href.lastIndexOf("/"+j_m.oVersion.name+"/")+j_m.oVersion.name.length+1);//项目目录
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
        //视频列表点击进详情
        $(document).on("click",".eye-list>ul>li>img",function(){
            var $itm=$(this).parent();
            j_m.changeHash("detail/video_id="+$itm.attr("data-id"));
        });
        Util.clearAllCookies();
        //Util.landscapeTip(true);//横屏提示
        //wxSdkApply();//微信sdk
        Util.responsiveScaling();
        //获取用户信息
        setUserinfo();
        //个人中心的打开和关闭
        //!function(){
        //    var $bt=$('#j-footer-to');
        //    setTimeout(function(){
        //        if(j_m.cateHash['usr']){
        //            $bt.attr('data-href','\-usr');
        //            $bt.addClass('on');
        //        }
        //    });
        //    $bt.click(function(e){
        //        if($(this).hasClass('on')){
        //            $(this).attr('data-href','\-usr');
        //            $(this).removeClass('on');
        //        }else{
        //            $(this).attr('data-href','\^usr=u');
        //            $(this).addClass('on');
        //        }
        //        //e.stopPropagation();
        //    });
        //}();
    }();
    //-------------------------
    //access
    !function(){
        j_m.extend({
            id:'main',
            title:'鹰眼',
            init:function(t){
                console.log('init');
            },
            beforeShow:function(t){
                console.log('beforeShow');
            },
            afterShow:function(cc,t){
                var $page=$(t[0]);
                console.log($page);
                console.log('afterShow');
                cc();//页面渲染
            },
            beforeHide:function(t){
                console.log('beforeHide');
            },
            afterHide:function(t){
                console.log('afterHide');
            },
            unload:function(t){
                console.log('unload');
            },
            res:{
                style:[],
                js:[['js/main_ini.js'],'js/main.js']
            }
        });
        j_m.extend("list",'搜索结果',function(cc,t){
            var $page=$(t[0]);cc();
        },{
            js:['js/list.js']
        });
        j_m.extend("detail",'详情',function(cc){
            var $page=$(j_m.currPage[0]);
            var $starCond=$page.find(".comm-posts-cond").children();
            var $sub=$page.find("#detail-video-box");
            var videoRes={};
            var baseVideo="http://tyjm.oss-cn-shanghai.aliyuncs.com/";
            //$.ajax({
            //    url:"http://test.weixinlukuang.com/wechat_web/index.php?d=account&c=video&m=getVideoDetail",
            //    type:"post",
            //    data:{
            //        secret:"5b5912180a48d6f50bd0ba620e04cd61458ad1cee22c799758f079659372b1053c517eda1fbf8d2efdba6ac3e2131b044dfc5a5e676d1b8e150c7b101f966a8d",
            //        video_id:Util.getUrlval("video_id")
            //    },
            //    success:function(data){
            //        var data=JSON.parse(data).data;
            //        videoRes.poster=baseVideo+data.video_cover;
            //        videoRes.url=baseVideo+data.video_url;
            //        //videoRes.url=baseVideo+"upload/20160806/v/wY-0Dgr7g4CzQrrglvQKiNsmr1mptZnDFSdTeUWZ7dJXwlJ5gV_zNVPO-UbR-xRD.mp4";
            //        $sub.html("<script src='sewise-player/sewise-player/player/sewise.player.min.js?server=vod&type=mp4&videourl="+videoRes.url+"&media_id=AR25sJ0Z2qjD7sTNkISV0klbGFSqBJqNZT7B14DeeQdc_rw2WidHpVUyUNDEhzn0&sourceid=&autostart=false&starttime=0&lang=en_US&title=VodVideo&buffer=5&claritybutton=disable&skin=vodFlowPlayer&fallbackurls=%7B%0A%09%22ogg%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.ogg%22%2C%0A%09%22webm%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.webm%22%0A%7D&topbardisplay=disable&poster="+videoRes.poster+"'><\/script>");
            //    }
            //});
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
            cc();
        },{
            js:['js/detail.js']
        });
        j_m.extend("edit",'编辑',function(cc){
            var $page=$(j_m.currPage[0]);cc();
        },{
            js:['js/edit.js']
        });
        j_m.extend("admin_reg",'注册管理员',function(cc){
            var $page=$(j_m.currPage[0]);cc();
        },{
            js:['admin/register.js']
        });
        j_m.extend("admin_check",'注册管理员',function(cc){
            var $page=$(j_m.currPage[0]);cc();
        },{
            js:['admin/check.js']
        });
        j_m.extend("success",'修改成功',function(cc){
            var $page=$(j_m.currPage[0]);cc();
        },{
            js:['js/success.js']
        });
        j_m.extend("demo",'demo',function(cc){
            var $page=$(j_m.currPage[0]);cc();
        },{
            js:['js/demo.js']
        });
        j_m.template('usr',function(cb){
            var $temp=$(j_m.temps['usr'][0]);
            var me=j_m.temps['usr'];
            if(!me.vm1){
                var vm1=me.vm1=new Vue({
                    el: $temp.find('#usr-center')[0],
                    data: {
                        view:j_m.cateHash['usr'],
                        info:{}
                    },
                    methods: {}
                });
                var vm2=me.vm2=new Vue({
                    el: $temp.find('#usr-list')[0],
                    data: {
                        view:j_m.cateHash['usr'],
                        list:[],
                        all:[]
                    },
                    methods: {
                        del:function(id){
                            Util.SelectAlert([{
                                id:true,
                                value: "确认删除"
                            },{
                                id:false,
                                value: "不删除了"
                            }],function(data){
                                if(data.id){
                                    //删除视频
                                    Util.callService({
                                        url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=delMyVideo",
                                        paras:{
                                            video_id:id
                                        },
                                        callback:function(data){
                                            if(+data.errcode===0){
                                                Util.Alert('删除成功');
                                                getMyList(resetData);
                                            }else{
                                                Util.Alert('删除失败');
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    }
                });
                var vm3=me.vm3=new Vue({
                    el: $temp.find('#usr-rank')[0],
                    data: {
                        view:j_m.cateHash['usr'],
                        ready:false,
                        ranks:[],
                        myrank:{
                            nickname:'',
                            rate:'',
                            numbers:0
                        }
                    },
                    ready:function(){
                        var me=this;
                        Util.callService({
                            url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=rankings",
                            callback:function(data){
                                me.ready=true;
                                var max=data.data[0].numbers;
                                for(var i=0;i<5;i++){
                                    var v=data.data[i];
                                    if(typeof v==='object'){
                                        v.rate=(v.numbers/max*0.8*100)+'%';
                                        me.ranks.push(v);
                                    }
                                }
                                me.myrank.numbers=data.data.mine;
                                me.myrank.rate=(me.myrank.numbers/max*0.8*100)+'%';
                                console.log(me.myrank);
                            }
                        });
                    },
                    methods: {}
                });
            }else{
                me.vm1.view=me.vm2.view=me.vm3.view=j_m.cateHash['usr'];
            }
            if(j_m.cateHash['usr']=='u'){//获取用户信息
                setUserinfo(function(data){
                    me.vm1.info=data;
                });
            }else{
                getMyList(resetData);
            }
            function resetData(){
                switch(j_m.cateHash['usr']){
                    case '0':
                        me.vm2.list=me.vm2.all['waiting'];
                        break;
                    case '1':
                        me.vm2.list=me.vm2.all['pass'];
                        break;
                    case '2':
                        me.vm2.list=me.vm2.all['reject'];
                        break;
                    default:
                        me.vm2.list=me.vm2.all['checking'];
                        break;
                }
                if(me.swiper){
                    me.swiper.destroy(true,true);
                }
                var $swp=$temp.find('#pool-box-list-swiper');
                //$swp.height(1000);
                //me.swiper = new Swiper($swp[0], {
                //    scrollbar: $swp.find('.wrap-scroll')[0],
                //    direction: 'vertical',
                //    slidesPerView: 'auto',
                //    mousewheelControl: true,
                //    freeMode: true
                //});
            }
            //获取列表
            function getMyList(cbk){
                //if(me.vm2.all.length!==0){
                //    cbk();
                //    setTimeout(function(){
                //        cb();
                //    });
                //    return;
                //}
                Util.callService({
                    url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=filtrate",
                    unlock:true,
                    paras:{
                        p:1,
                        n:10,
                        status:j_m.cateHash['usr']
                    },
                    callback:function(data){
                        me.vm2.all=data.data;
                        cbk();
                        setTimeout(function(){
                            cb();
                        });
                    }
                });
            }
        });

        //-------------------------
        j_m.extendBeforeRender(function(){
            //检验用户中心模板
            !function(){
                if(j_m.cateHash.usr){
                    j_m.temps['usr'].show();
                }else{
                    j_m.temps['usr'].hide();
                }
            }();
        });
        //公共渲染——渲染前
        j_m.extendBeforeShow(function(t){
            var $page=$(t[0]);//当前页面
            $page.find("*").off("click touchstart touchend touchmove scroll focus blur change select load keydown resize");
            if(j_m.device.plat==="android"){
                wxSdkApply();//微信sdk
            }
        });
        //-------------------------
        //公有渲染——渲染后
        j_m.extendAfterShow(function(t){
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
        j_m.iniPages();
    }();
}();
//非空检测
function isFormatedForNull(){
    var $fnull=$(j_m.currPage[0]).find("[data-format-null]");
    for(var i= 0,len=$fnull.length;i<len;i++){
        var $this=$fnull.eq(i);
        if($this.val().trim()==""){
            Util.Alert($this.attr("data-format-null"));
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
    try{
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
    }catch(e){}
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
        url: oUserinfo.addr.interface + "/index.php?d=v2_violate_info&c=v2_violate_info&m=get_city",
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
        $page.find("#car-type").empty().hide();
        $page.find("#car-brand").empty().hide();
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
    return;
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
                    o.str+=textTrim($(this).text());
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
                o.str=textTrim($(this).text());
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
        url:oUserinfo.addr.interface+"/index.php?d=pinche&c=car_sharing&m=ajax_get_car",
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
//设置用户信息
function setUserinfo(){
    var cb=arguments[0];
    if(oUserinfo.info&&!arguments[1]){
        cb&&cb(oUserinfo.info);
        return;
    }
    Util.callService({
        url:oUserinfo.addr.interface+"/index.php?d=account&c=account&m=getProfile",
        paras:{
            type:2
        },
        callback:function(data){
            oUserinfo.info=oUserinfo.info||{};
            for(var k in data.data){
                oUserinfo.info[k]=data.data[k];
            }
            console.log("更新了个人中心");
            cb&&cb(oUserinfo.info);
        }
    });
}






















