//创建时间：2015年12月24日 15:05:04
//创建人：李君
//最后更新时间：2015年12月24日 15:07:41
//更新人：李君
//说明：公用函数库
/***************************************************************/
//拓展Util
try{
    define(['jquery'],librarycallback);
}catch(e){
    Util=librarycallback(jQuery);
}
function librarycallback($){
    var Util={};
    //---------------------------
    Util.setMask=function(t){
        var $loading=$("#loading-layer");
        if(t=="on"){
            if($loading.length==0){
                var str='';
                str+='<div id="loading-layer" class="loading-layer">';
                str+='<div class="loading-con">';
                str+='<image src="images/loading.png" />';
                str+='</div>';
                str+='</div>';
                $("body").append(str);
            }
            $loading.show();
        }else if("off"){
            $loading.hide();
        }
    }
    Util.clearForm=function(){
        $(':input').not(':button, :submit, :reset, :hidden,[readonly]').val('').removeAttr('checked').removeAttr('selected');
    }
    //埋点函数
    Util.maiDian= function(p, fn){
        if(oUserinfo.test){return;}
        return;
        $.ajax({
            url:"http_key_total.php",
            type: "post",
            data: {
                uid:p.uid||oUserinfo.openid,
                wid:p.uid||oUserinfo.wid,
                key:p.key
            },
            dataType: "json",
            async:true,
            success: function(data) {
                if(fn){
                    fn(data);
                }
            }
        });
    };
    //添加顶部提示
    Util.Alert=function(msg,type,title){
        //参数:
        //msg:内容
        //type:默认为e代表error,s代表success,w代表warn
        var $prompt=$("#Prompt");
        if($prompt.length===0){
            $prompt=$("<div id='Prompt' class='Prompt'><h3>"+(title||"提示")+"</h3><p></p></div>").appendTo($('body'));
        }
        var clsNa=(function(){
            switch(type){
                case "s":
                    return "PromptSuccess";
                    break;
                case "w":
                    return "PromptWarn";
                    break;
                default:
                    return "PromptError";
                    break;
            }
        })();
        $prompt.children("p").html("<div class=\"prompt "+clsNa+"\">" + msg + "</div>");
        $prompt.show(100);
        if(Util.stvAlert){
            clearTimeout(Util.stvAlert);
        }
        Util.stvAlert=setTimeout(function() {
            $prompt.hide(100);
        }, 2000);
    }
    //选择框
    Util.SelectAlert=function(arr,callback,sty,layerClose){
        var $p=$("#SelectPompt");
        if($p.length===0){
            $p=$("<div id='SelectPompt' class='SelectPompt'><ul></ul></div>").appendTo($("body"));
            $p.after("<div id='SelectLayer' class='SelectLayer'></div>");
        }
        var $layer=$p.next("#SelectLayer");
        var $list=$p.children("ul");
        if(arguments.length===1){
            if(arguments[0]==='close'){
                $p.hide();
                $layer.hide();
                $list.empty();
                return;
            }
        }
        $list.empty();
        for(var i= 0,len=arr.length;i<len;i++){
            $list.append('<li data-id="'+arr[i].id+'">'+arr[i].value+'</li>');
        }
        if(sty){
            $list.children().each(function(){
                $(this).css(sty);
            });
        }
        if(layerClose){
            $layer.off("click");
            $layer.on("click",function(){
                $(this).fadeOut(300);
                $p.fadeOut(300);
            });
        }
        $p.show();
        $layer.show();
        $list.children().on("click",function(){
            var ind=$(this).index();
            if(callback){
                callback({id:arr[ind].id,value:arr[ind].value});
            }
            if(arr[ind].callback){
                arr[ind].callback();
            }
            $p.hide();
            $layer.hide();
            $list.empty();
        });
    }
    //封装的ajax
    Util.callService=function(p) {
        if (p == null || typeof(p.url) == 'undefined') {
            return;
        }
        var paras = p.paras;
        if (typeof(paras) == 'undefined') {
            paras = {};
        }
        var async = p.async===false? p.async:true;
        // 统一获取access_token和userid
        if(!paras.wid){
            oUserinfo.wid&&(paras.wid=oUserinfo.wid);
        }
        if(!paras.openid){
            oUserinfo.openid&&(paras.openid=oUserinfo.openid);
        }
        if(!paras.uid){
            oUserinfo.uid&&(paras.uid=oUserinfo.uid);
        }
        if(!paras.unid){
            oUserinfo.unid&&(paras.unid=oUserinfo.unid);
        }
        if(!paras.secret){
            oUserinfo.secret&&(paras.secret=oUserinfo.secret);
        }
        if(!p.unlock){//默认情况下，加载过程中将锁屏
            Util.setMask("on");
        }
        var xhr=$.ajax({
            url: p.url,
            type: p.type||"post",
            data: paras,
            dataType: "json",
            async:async,
            success: function(data) {
                if(!p.unlock){
                    Util.setMask("off");
                }
                if (p.callback) {
                    p.callback(data);
                }
            }
        });
        return xhr;
    }
    //选择日期和时间范围
    Util.selDateTimeRange=function(dDef,dStart,dEnd,tar,fn,bToday){
        var $date=tar;
        var $listDate=$("#list-date");
        //if($("#list-date").length==0){
        //    var $listDate=$("#list-date").appendTo("body");
        //}
        //var $listTime=$("#list-timerange");
        var dt=new Date();
        var y=dt.getFullYear();
        var m=dt.getMonth();
        var d=dt.getDate();
        var todayStamp=new Date().getTime();
        var startStamp=new Date(dStart.y,dStart.m-1,dStart.d).getTime();
        var defStamp=new Date(dDef.y,dDef.m-1,dDef.d).getTime();
        if(bToday&&todayStamp>startStamp){
            minValue=new Date(y,m,d);
        }else{
            minValue=new Date(dStart.y,dStart.m-1,dStart.d);
        }
        //日期
        $listDate.mobiscroll().date({
            theme: 'mobiscroll',
            lang:"zh",
            display: 'modal',
            defaultValue: new Date(dDef.y,dDef.m-1,dDef.d),
            dateFormat: 'yyyy/mm/dd',
            minDate: minValue,
            maxDate: new Date(dEnd.y,dEnd.m-1,dEnd.d),
            onSelect:function(data){
                $date.attr("data-date",data).val(data);
                if(typeof(arguments[3])=="function"){

                }
                if(fn){
                    fn(data);
                }
            }
        });
        $date.click(function(){
            $listDate.mobiscroll('show');
            return false;
        });
    }
    //横屏提示
    Util.landscapeTip=function(isFobidden,plat){
        var str='';
        var oWin={};
        var stvCloseCvs;
        str+='<canvas class="orienland-box-cvs" id="orienland-box-cvs" style="z-index:100000;position:fixed;display:none;top:0;left:0;bottom:0;right:0; width:100%;height:100%;"></canvas>';
        str+='<div class="orienland-box-layer" id="orienland-box-layer" style="z-index:99999;position:fixed;display:none;background:rgba(0,0,0,1);top:0;left:0;bottom:0;right:0;width:100%;height:100%;"></div>';
        $("body").append(str);
        var $cLayer=$("#orienland-box-layer");
        var cvs=document.getElementById("orienland-box-cvs");
        var ctx=cvs.getContext("2d");
        var oCVS;
        cvs.addEventListener("touchmove",function(e){
            e.preventDefault();
            return false;
        });
        var oAnimationList={
            getNext:function(el){
                var ind=oAnimationList.arrFun.indexOf(el);
                if(ind+1<this.arrFun.length){
                    oAnimationList.arrFun[ind+1]();
                }
            },
            arrFun:[]
        };
        oAnimationList.arrFun.push(function(){
            var self=arguments.callee;
            $(cvs).show();
            var n=50;
            var step=2*Math.PI/n;
            ctx.translate(oCVS.w/2,oCVS.h/2);
            ctx.strokeStyle="#fff";
            ctx.strokeWidth=1;
            ctx.fillStyle="#fff";
            for(var i= 0;i<=n;i++){
                !function(i){
                    setTimeout(function(){
                        ctx.beginPath();
                        ctx.arc(0,0,30,0,step*i);
                        ctx.stroke();
                        ctx.closePath();
                        if(i>=n){
                            clearCtx();
                            oAnimationList.getNext(self);
                        }
                    },10*i);
                }(i);
            }
        });
        oAnimationList.arrFun.push(function(){
            var self=arguments.callee;
            var grd=ctx.createRadialGradient(0,0,1,0,0,30);
            grd.addColorStop(0,"rgba(255,255,255,0)");
            grd.addColorStop(1,"rgba(255,255,255,255)");
            ctx.fillStyle=grd;
            var n=100;
            var step=15;
            var cx,cy, r;//分别代表圆心x、y、半径
            var oArc1={
                x:0,
                y:0,
                r:30
            };
            var oArc2={
                x:0,
                y:0,
                r:30
            };
            var _continue=true,_continue2=true,_continue3=true;
            for(var i= 0;i<=n;i++){
                !function(i){
                    var _this=setTimeout(function(){
                        if(_continue===true) {
                            clearCtx();
                            if (i < 20) {
                                //圆1
                                ctx.beginPath();
                                oArc1.x -= step;
                                oArc1.y--;
                                oArc1.r = 30;
                                ctx.arc(oArc1.x, oArc1.y, oArc1.r, 0, 360, false);
                                ctx.stroke();
                                ctx.closePath();
                                //圆2
                                ctx.beginPath();
                                oArc2.x += step;
                                oArc2.y++;
                                oArc2.r = 30;
                                ctx.arc(oArc2.x, oArc2.y, oArc2.r, 0, 360, false);
                                ctx.stroke();
                                ctx.closePath();
                            } else if (i < 100) {
                                //圆1
                                ctx.beginPath();
                                oArc1.x += step;
                                oArc1.y += 5;
                                oArc1.r = 30;
                                ctx.arc(oArc1.x, oArc1.y, oArc1.r, 0, 360, false);
                                ctx.stroke();
                                ctx.closePath();
                                //圆2
                                ctx.beginPath();
                                oArc2.x -= step;
                                oArc2.y -= 5;
                                oArc2.r = 30;
                                ctx.arc(oArc2.x, oArc2.y, oArc2.r, 0, 360, false);
                                ctx.stroke();
                                ctx.closePath();
                                if (oArc1.x === oArc2.x) {
                                    _continue = false;
                                }
                            }
                        }else if(_continue2===true){
                            clearCtx();
                            //圆1
                            ctx.beginPath();
                            oArc1.x-=step;
                            oArc1.y-=5;
                            oArc1.r-=0.5;
                            ctx.arc(oArc1.x, oArc1.y, oArc1.r, 0, 360, false);
                            ctx.stroke();
                            ctx.closePath();
                            //圆2
                            ctx.beginPath();
                            oArc2.x-=(step+1);
                            oArc2.y+=5;
                            oArc2.r++;
                            ctx.arc(oArc2.x, oArc2.y, oArc2.r, 0, 360, false);
                            ctx.stroke();
                            ctx.closePath();
                            if (oArc1.y === oArc2.y) {
                                _continue2 = false;
                            }
                        }else if(_continue3===true){
                            ctx.beginPath();
                            ctx.fillStyle="#fff";
                            ctx.font="32px 微软雅黑";
                            ctx.fillText("横屏体验欠佳，请您竖屏使用~",oArc1.x+80,oArc1.y+10);
                            ctx.closePath();
                            _continue3=false;
                        }else{
                            if(!isFobidden){
                                if(stvCloseCvs){
                                    clearTimeout(stvCloseCvs);
                                }
                                stvCloseCvs=setTimeout(function(){
                                    $cLayer.fadeOut(200);
                                    $(cvs).hide();
                                    clearCtx();
                                },500);
                            }
                            i=n;
                            return;
                        }
                        if (i >= n) {
                            oAnimationList.getNext(self);
                        }
                    },20*i);
                }(i);
            }
        });
        function clearCtx(){
            ctx.clearRect(-oCVS.w/2,-oCVS.h/2,oCVS.w,oCVS.h);
        }
        !function(){
            if(plat&&plat==="android"){
                //解决方案1
                !function(){
                    return;
                    $cLayer.addClass("android");
                }();
                //解决方案2
                !function() {
                    window.matchMedia("(orientation: portrait)").addListener(function (m) {
                        var tag = document.activeElement.tagName;
                        if (m.matches) {
                            drawforOrien(0);
                        } else {
                            if (["INPUT"].indexOf(tag) === -1) {
                                drawforOrien(90);
                            }
                        }
                    });
                }();
                //解决方案3
                !function(){
                    return;
                    var updateOrientation = function(){
                        var orien = (window.innerWidth > window.innerHeight) ? 90 : 0;
                        drawforOrien(orien);
                    };
                    var init = function(){
                        updateOrientation();
                        //监听resize事件
                        window.addEventListener('resize',updateOrientation,false);
                    };
                    window.addEventListener('DOMContentLoaded',init,false);
                }();
            }else {
                drawforOrien(window.orientation);
                window.onorientationchange = function () {
                    var orien = window.orientation;
                    drawforOrien(orien);
                };
            }
        }();

        function drawforOrien(orien){
            oWin={
                w:document.documentElement.clientWidth,
                h:document.documentElement.clientHeight
            }
            $(cvs).attr("width",oWin.w<<1);
            $(cvs).attr("height",oWin.h<<1);
            $(cvs).css("width",oWin.w);
            $(cvs).css("height",oWin.h);
            oCVS={
                w:oWin.w<<1,
                h:oWin.h<<1
            }
            if(orien==90||orien==-90){
                //document.activeElement.blur();
                clearTimeout(stvCloseCvs);
                $cLayer.stop().show();
                $(cvs).show();
                oAnimationList.arrFun[0]();
            }else{
                $cLayer.hide();
                $(cvs).hide();
                clearCtx();
            }
        }
    }
    //预加载
    Util.loadingPictrue=function() {
        Util.setMask("on");
        var $imgs = $("img");
        var imgslen = $imgs.length;
        var $dom = $("*:not('img')");
        var domlen = $dom.length;
        var arrBgUrl = [];
        for (var i = 0; i < imgslen; i++) {
            arrBgUrl.push($imgs.eq(i).attr("src"));
        }
        for (var i = 0; i < domlen; i++) {
            var $othis=$dom.eq(i);
            if ($othis.css("backgroundImage") && $othis.css("backgroundImage")!='none') {
                var bgAttr = $othis.css("backgroundImage");
                var bgPath = bgAttr.substring(bgAttr.indexOf("(") + 1, bgAttr.indexOf(")"));//将背景图片的地址取出来
                if (bgPath.indexOf("\"") != -1) {
                    bgPath = bgPath.substring(bgPath.indexOf("\"") + 1, bgPath.lastIndexOf("\""));
                } else if (bgPath.indexOf("\'") != -1) {
                    bgPath = bgPath.substring(bgPath.indexOf("\'") + 1, bgPath.lastIndexOf("\'"));
                }
                arrBgUrl.push(bgPath);
            }
        }
        var piclen = arrBgUrl.length;//所有待加载的图片（包括img标签和背景图片）
        //加载img
        var picCnt = 0;//当前正在加载中的图片序号
        function loadImage(path) {
            var img = new Image();
            img.src = path;
            img.onload = function () {
                picCnt++;
                if (picCnt < piclen) {
                    loadImage(arrBgUrl[picCnt]);
                    Util.setMask("on");
                } else {
                    Util.setMask("off");
                    return;
                }
            };
        }
        loadImage(arrBgUrl[picCnt]);
    }
    //按钮状态改变
    Util.changeButtonStatus=function(bt,str,fn){
        bt.on("click",function(){
            var $cap=$(this).children("em").eq(0);
            $(this).off("click");
            var $cap2=$('<em>'+str+'</em>').appendTo($(this));
            $cap.animate({
                opacity:0,
                left:"-100%"
            },300).queue(function(next){
                $(this).remove();
                next();
            });
            $cap2.css({
                left:"100%"
            }).animate({
                left:0
            },500,function(){
                if(fn){fn();}
            });
        });
    }
    //显示和隐藏暗层
    Util.switchLayer=function(b,opt){
        var $layer=$("body").children(".body-layer");
        if($layer.length==0){
            $layer=$('<div class="body-layer"></div>').appendTo($("body"));
        }
        if(opt){
            $layer.css("background","rgba(0,0,0,"+opt+")");
        }else{
            $layer.css("background","rgba(0,0,0,0.8)");
        }
        if(b==="show"){
            $layer.fadeIn();
        }else{
            $layer.fadeOut();
        }
        removeDefaultEvent($layer,"touchmove");
    }
    //移除默认事件
    Util.removeDefaultEvent=function(tar,type){
        tar.off(type);
        tar.on(type,function(e){
            e.preventDefault();
        });
    }
    //下雨效果
    Util.rainDotsFromSideToSide=function(tar,type,fn){
        var ts={
            w:tar.width(),
            h:tar.height()
        }
        var len=50;
        var maxLeft=ts.w-30;
        var $list=$("<ul></ul>").appendTo(tar);
        var arr=[];
        removeDefaultEvent($list,"touchmove");//移除默认事件
        for(var i=0;i<len;i++){
            var v={
                b:~~(Math.random()*200-20),
                r:Math.random()*180-90,
                l:Math.random()*maxLeft
            };
            arr.push(v);
            v.j=v.b+~~(400-v.b);
        }
        for(var i=0;i<len;i++){
            var $l=$("<li></li>").appendTo($list);
            var $i=$("<i></i>").appendTo($l);
            var v=arr[i];
            $i.css({
                transform:"rotate("+(v.r)+"deg)"
            });
            $l.css({
                bottom:ts.h,
                left:~~(v.l)
            }).delay(i*50).queue(function(next){
                $(this).addClass("in");
                next();
            }).animate({
                bottom:v.b
            },600).animate({
                bottom:v.j
            },500,function(){
                var ind=$(this).index();
                if(ind>len-10&&v.j>300){
                    $(this).children().addClass("star");
                    $(this).stop().fadeOut(100);
                    if(ind==len-1){
                        fn();
                    }
                }
            }).animate({
                bottom:v.b
            },function(){
            });
        }
    };
    return Util;
}
