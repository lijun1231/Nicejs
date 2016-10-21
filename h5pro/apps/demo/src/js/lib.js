//创建时间：2015年12月24日 15:05:04
//创建人：李君
//最后更新时间：2015年12月24日 15:07:41
//更新人：李君
//说明：公用函数库
/***************************************************************/
//拓展Util
var Util={};
//---------------------------
Util.getRectBoxObj=function(element){
    /*box.getBoundingClientRect().top // 元素上边距离页面上边的距离
     box.getBoundingClientRect().right // 元素右边距离页面左边的距离
     box.getBoundingClientRect().bottom // 元素下边距离页面上边的距离
     box.getBoundingClientRect().left // 元素左边距离页面左边的距离
     */
    var box = element.getBoundingClientRect();
    var top = box.top;         // 元素上边距离页面上边的距离
    var right = box.right;       // 元素右边距离页面左边的距离
    var bottom = box.bottom;      // 元素下边距离页面上边的距离
    var left = box.left;        // 元素左边距离页面左边的距离
    var width = box.width || right - left;     //元素自身的宽度
    var height = box.height || bottom - top;     //元素自身的高度
    return {'top': top, 'left': left, 'right': right, 'bottom': bottom, 'width': width, 'height': height};
};
Util.loadByHash=function(fn){
    switch(pageHash){
        case "fespic":
            break;
        default:
    }
    if(fn&&typeof fn=="function"){
        fn();
    }
}
Util.changeHash=function(resource,fn){//hash值改变
    window.location.hash = resource;
    if(fn&&typeof fn=="function"){
        fn();
    }
}
Util.locationHref=function(href){
    JPage.gotoPage(href,"hard");
}
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
Util.uuid= function(){
    var len=arguments.length?arguments[0]:16;
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random()*len|0, v = c == 'x' ? r : (r&0x3|0x8);
        return v.toString(len);
    });
}
//加密函数
Util.base64_encode= function(input){
    input = Base64.strUnicode2Ansi(input);

    var output = "";
    var chr1, chr2, chr3 = "";
    var enc1, enc2, enc3, enc4 = "";
    var i = 0;

    do{
        chr1 = input.charCodeAt(i++);
        chr2 = input.charCodeAt(i++);
        chr3 = input.charCodeAt(i++);

        enc1 = chr1 >> 2;
        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
        enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
        enc4 = chr3 & 63;

        if (isNaN(chr2)){
            enc3 = enc4 = 64;
        }else if(isNaN(chr3)){
            enc4 = 64;
        }

        output = output +
            Base64.keyStr.charAt(enc1) +
            Base64.keyStr.charAt(enc2) +
            Base64.keyStr.charAt(enc3) +
            Base64.keyStr.charAt(enc4);
        chr1 = chr2 = chr3 = "";
        enc1 = enc2 = enc3 = enc4 = "";

    }while(i < input.length);

    return output;
}
//埋点函数
Util.maiDian= function(p, fn){
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
//预加载图片
Util.preloadImage=function(src,fn){
    var pic=new Image();
    pic.src=src;
    pic.onload = function(){
        if(fn){
            fn();
        }
    }
}
Util.preloadMedia=function(type,src,fn){
    var res;
    switch(type){
        case "audio":
            res=new Audio(src);
            break;
        case "vedio":
            res=new video(src);
            break;
    }
    res.onload = function(){
        if(fn){
            fn();
        }
    }
}
//原型拓展--------------------------------------
//去跳前后空格
String.prototype.trim=function(){
    return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
}
//返回某个元素在数组中的索引值的
Array.prototype.indexOf = function(el){
    for (var i=0,n=this.length; i<n; i++){
        if (this[i] === el){
            return i;
        }
    }
    return -1;
}
//获取url参数
function getUrlval(name) {
    var url = location.search;
    var Request = new Object();
    if (url.indexOf("?") != -1) {
        var str = url.substr(1);
        strs = str.split("&");
        for (var i = 0; i < strs.length; i++) {
            Request[strs[i].split("=")[0]] = (strs[i].split("=")[1]);
        }
    }
    return Request[name];
}
/*判断字符串是不是邮箱*/
function isEmail(str) {
    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}
/*获取cookie*/
function getCookie(c_name) {
    if (document.cookie.length > 0) {
        c_start = document.cookie.indexOf(c_name + "=")
        if (c_start != -1) {
            c_start = c_start + c_name.length + 1
            c_end = document.cookie.indexOf(";", c_start)
            if (c_end == -1) c_end = document.cookie.length
            return unescape(document.cookie.substring(c_start, c_end))
        }
    }
    return ""
}
/*设置cookie*/
function setCookie(c_name, value, expiredays) {
    var exdate = new Date()
    exdate.setDate(exdate.getDate() + expiredays)
    document.cookie = c_name + "=" + escape(value) +
        ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
}
//删除cookies
function clearCookie(name) {
    setCookie(name, "", -1);
}
//清除所有cookie
function clearAllCookies(){
    var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
    if (keys) {
        for (var i = keys.length; i--;)
            document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
    }
}
//验证座机
function checkPhone(sPhone) {
    if ((/^(\d{3,4}\-)?\d{7,8}$/i.test(sPhone))) { //座机格式010-98909899
        return true;
    } else if ((/^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/.test(sPhone))) { //座机格式01098909899
        return true;
    } else if ((/^(400)\d{7}$/.test(sPhone))) { //座机格式4000000000
        return true;
    } else {
        return false;
    }
}
//验证手机
function checkMobile(sMobile) {
    if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test(sMobile))) {
        return false;
    } else {
        return true;
    }
}
//验证身份证号
function checkIDCard(sCard) {
    var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if(reg.test(sCard) === false){
        return  false;
    }else{
        return true;
    }
}
//验证姓名
function checkName(s,notChargeLen) {
    if(notChargeLen){
        var reg = /^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/;
    }else{
        var reg = /^([\u4e00-\u9fa5]{2,}|([a-zA-Z]+\s?){2,})$/;
    }
    if(reg.test(s) === false){
        return  false;
    }else{
        return true;
    }
}
//验证车牌号
function checkCarPlate(s) {
    var reg = /(^[a-zA-Z]{1}(\d|[a-zA-Z]){5}$)/;
    if(reg.test(s) === false){
        return  false;
    }else{
        return true;
    }
}
//验证固定位数或固定范围位数的字符或数字
function checkLimitCode(str,type,min,max,arr){
    //type：类型，"letter"代表字母，"num"代表数字，"code"代表字母+数字，arr是允许出现的字符列表
    //当min===max的时候，表示定长字符串
    var t=arr?arr.join(""):"";
    switch(type){
        case "letter":
            t="a-zA-Z"+t;
            break;
        case "num":
            t="0-9"+t;
            break;
        case "code":
            t="0-9a-zA-Z"+t;
            break;
    }
    var reg=eval('\/(^['+t+']{'+min+','+max+'}$)\/');
    return reg.test(str);
}
//添加顶部提示
$(function(){
    var str="<div id='Prompt' class='Prompt'><h3>提示</h3><p></p></div>";
    $("body").append(str);
});
//红色错误顶部提示
var stvAlert;
function ErrorAlert(msg) {
    var $prompt=$("#Prompt");
    $prompt.children('p').html("<div class=\"prompt PromptError\">" + msg + "</div>");
    $prompt.fadeIn(100);
    if(stvAlert){
        clearTimeout(stvAlert);
    }
    stvAlert=setTimeout(function() {
        $prompt.fadeOut(100);
    }, 2000);
}
//绿色正确顶部提示
function SuccessAlert(msg) {
    var $prompt=$("#Prompt");
    $prompt.children('p').html("<div class=\"prompt PromptSuccess\">" + msg + "</div>");
    $prompt.slideDown();
    if(stvAlert){
        clearTimeout(stvAlert);
    }
    stvAlert=setTimeout(function() {
        $prompt.fadeOut(100);
    }, 2000);
}
//黄色警告顶部提示
function WarnAlert(msg) {
    var $prompt=$("#Prompt");
    $prompt.children('p').html("<div class=\"prompt PromptWarn\">" + msg + "</div>");
    $prompt.hide().slideDown();
    if(stvAlert){
        clearTimeout(stvAlert);
    }
    stvAlert=setTimeout(function() {
        $prompt.fadeOut(100);
    }, 2000);
}
//添加选择框
$(function(){
    var str="<div id='SelectPompt' class='SelectPompt'><ul></ul></div><div id='SelectLayer' class='SelectLayer'></div>";
    $("body").append(str);
});
//选择框
function SelectAlert(arr,callback,sty,layerClose){
    var $p=$("#SelectPompt");
    var $list=$p.children("ul");
    var $layer=$("#SelectLayer");
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
//去除前后空格
function textTrim(txt) {
    if(typeof txt=="string"){
        return txt.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
    }else{
        for(i in txt){
            if(txt[i]&&(typeof txt[i]=="string")){
                txt[i]=txt[i].replace(/^\s\s*/, '').replace(/\s\s*$/, '');
            }else{
                txt[i]="";
            }
        }
        return txt;
    }
}
/*封装的ajax*/
function callService(p) {
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
        paras.wid=oUserinfo.wid;
    }
    if(!paras.openid){
        paras.openid=oUserinfo.openid;
    }
    if(!paras.uid){
        paras.uid=oUserinfo.uid;
    }
    if(!paras.unid){
        paras.unid=oUserinfo.unid;
    }
    if(!p.unlock){//默认情况下，加载过程中将锁屏
        Util.setMask("on");
    }
    var xhr=$.ajax({
        url: p.url,
        type: p.type,
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

//获取元素绝对位置Left
function getElementLeft(element) {
    var actualLeft = element.offsetLeft;
    var current = element.offsetParent;
    while (current !== null) {
        actualLeft += current.offsetLeft;
        current = current.offsetParent;
    }
    return actualLeft;
}
//获取元素绝对位置Top
function getElementTop(element) {
    var actualTop = element.offsetTop;
    var current = element.offsetParent;
    while (current !== null) {
        actualTop += current.offsetTop;
        current = current.offsetParent;
    }
    return actualTop;
}
//是否在页面底部
function isPageEnd(){
    if(oDocinfo.st+oDocinfo.ch+1>oDocinfo.sh){
        return true;
    }
    return false;
}
//选择日期和时间范围
function selDateTimeRange(dDef,dStart,dEnd,tar,fn,bToday){
    var $date=tar;
    var $listDate=$("#pub-date");
    if($listDate.length===0){
        $listDate=$("<div id='pub-date'></div>").appendTo($("body"));
    }
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
//页面缩放式适配
function responsiveScaling(){
    var DeviceWidth = window.screen.availWidth;//先获取设备可用宽度
    var size=DeviceWidth/25;
    (document.documentElement||document.body.parentNode).style.fontSize=size+'px';
    document.body.style.fontSize=size+'px';
}
//横屏提示
function landscapeTip(isFobidden){
    var str='';
    var oWin={};
    var stvCloseCvs;
    str+='<canvas class="orienland-box-cvs" id="orienland-box-cvs" style="z-index:100000;position:fixed;display:none;top:0;left:0;bottom:0;right:0; width:100%;height:100%;"></canvas>';
    str+='<div class="orienland-box-layer" id="orienland-box-layer" style="z-index:99999;position:fixed;display:none;background:rgba(0,0,0,0.9);top:0;left:0;bottom:0;right:0;width:100%;height:100%;"></div>';
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
    window.onorientationchange=function(){
        var orien=window.orientation;
        drawforOrien(orien);
    }
    drawforOrien(window.orientation);
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
            document.activeElement.blur();
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
//上传图片处理
function sendImage(cvs) {
    // 获取Base64编码后的图像数据，格式是字符串
    // "data:image/png;base64,"开头,需要在客户端或者服务器端将其去掉，后面的部分可以直接写入文件。
    var dataurl = cvs.toDataURL("image/png");
    // 为安全 对URI进行编码
    var imagedata = encodeURIComponent(dataurl);
    return imagedata;
}
//预加载
function loadingPictrue() {
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
function changeButtonStatus(bt,str,fn){
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
function switchLayer(b,opt){
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
function removeDefaultEvent(tar,type){
    tar.off(type);
    tar.on(type,function(e){
        e.preventDefault();
    });
}
//下雨效果
function rainDotsFromSideToSide(tar,type,fn){
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
}























