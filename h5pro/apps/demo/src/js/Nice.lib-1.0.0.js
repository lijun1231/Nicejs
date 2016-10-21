/**
 * version:
 * update:2016年10月8日16:45:41
 * tip:
 * 计划：
 * 分离为Nice.js分离为Nice-1.0.0js和Nice.lib-1.0.0.js，不再向上兼容
 * 二者完全独立，Nice.lib要求：满足AMD规范、原生，文件按功能区进行划分：原生函数拓展、表单区 Nice.lib.Form（表单相关,如验证等）、UI区 Nice.lib.UI（UI层）、
 * Created by jun.li on 2016/10/08.
 */
/***************************************************************/
//拓展lib
(function(_){
    var root=this;
    var lib={};
    lib.drag = function (target, isDelay) {
        /*
         *拖拽，可弹性拖拽
         *paras:
         * 第一个参数为拖拽对象（或选择器）/dom对象或string/不可空
         * 第二个参数为是否弹性拖拽/boolean/可空
         * */
        var tar = typeof target == "string" ? document.querySelector(target) : target;
        var tarSize = {
            w: ~~(tar.offsetWidth / 2),
            h: ~~(tar.offsetHeight / 2)
        };
        var reqAniId;
        var posRec = {
            x: parseInt(tar.offsetLeft),
            y: parseInt(tar.offsetTop)
        }

        function dragTog(posTouch) {
            var edge = {
                ex: posTouch.x - posRec.x,
                ey: posTouch.y - posRec.y
            }
            var eStep;
            var bBase;
            eStep = {sx: edge.ex / 10, sy: edge.ey / 10};
            bBase = edge.ex > edge.ey;
            cancelAnimationFrame(reqAniId);
            step(eStep, posTouch, bBase);
        }

        function step(eStep, posTouch, bBase) {
            if (!isDelay) {
                posRec.x = posTouch.x;
                posRec.y = posTouch.y;
                tar.style.left = posRec.x + "px";
                tar.style.top = posRec.y + "px";
                return;
            }
            if (!bBase) {
                bEnd = Math.abs(posTouch.x - posRec.x) < Math.abs(eStep.sx);
            } else {
                bEnd = Math.abs(posTouch.y - posRec.y) < Math.abs(eStep.sy);
            }
            if (bEnd) {
                posRec.x = posTouch.x;
                posRec.y = posTouch.y;
                tar.style.left = posRec.x + "px";
                tar.style.top = posRec.y + "px";
                return;
            } else {
                posRec.x += eStep.sx;
                posRec.y += eStep.sy;
                tar.style.left = posRec.x + "px";
                tar.style.top = posRec.y + "px";
            }
            reqAniId = requestAnimationFrame(function () {
                return step(eStep, posTouch, bBase);
            });
        }

        tar.addEventListener("touchstart", function () {
            tar.removeEventListener("touchmove", bindMove, false);
        }, false);
        tar.addEventListener("touchend", function () {
            tar.removeEventListener("touchmove", bindMove, false);
        }, false);
        var stv;

        function bindMove(e) {
            if (!stv) {
                if (!isDelay) {
                    var ev = e || window.event;
                    var t = ev.touches[0];
                    posTouch = {
                        x: t.clientX - tarSize.w,
                        y: t.clientY - tarSize.h
                    }
                    dragTog(posTouch);
                } else {
                    stv = setTimeout(function () {
                        var ev = e || window.event;
                        var t = ev.touches[0];
                        posTouch = {
                            x: t.clientX - tarSize.w,
                            y: t.clientY - tarSize.h
                        }
                        requestAnimationFrame(function () {
                            return dragTog(posTouch);
                        });
                        clearTimeout(stv);
                        stv = undefined;
                    }, 80);
                }
            } else {
            }
        }
    };
    //--------------------------------------------------------------------------------------------
    //-------------------------------------------Event--------------------------------------------
    // Event
    lib.econt = {};
    lib.dcont = [];
    lib.dcont = [];
    lib.etype = {
        tap: {
            name: "tap",
            custom: new CustomEvent("tap", {
                detail: {
                    message: "hallo event！",
                    time: new Date()
                },
                bubbles: false,
                cancelable: true
            }),
            dispatch: function (el) {
                var _self = this;
                var _t = {};
                _t.fnSt = function (e) {
                    _t.isCli = true;
                    el.addEventListener("touchmove", _t.fnMv, false);
                    el.addEventListener("touchend", _t.fnEd, false);
                };
                el.addEventListener("touchstart", _t.fnSt, false);
                _t.fnMv = function (e) {
                    _t.isCli = false;
                };
                _t.fnEd = function (e) {
                    el.removeEventListener("touchmove", _t.fnMv, false);
                    el.removeEventListener("touchend", _t.fnEd, false);
                    if (_t.isCli) {
                        el.dispatchEvent(_self.custom);
                    }
                };
            }
        }
    };
    lib.evStack = function (el, type, fn) {
        var ind = Nice.dcont.getIndex(el);
        if (ind === -1) {
            var s = Nice.createRandomAlphaNum(8);
            var tt = Nice.econt[s] = {
                el: el,
                arr: []
            };
            tt.arr.push({
                type: type,
                fn: fn
            });
            Nice.dcont.push(el);
        } else {
            (function (tt) {
                tt.arr.push({
                    type: type,
                    fn: fn
                });
            })((function (v) {
                for (var i in Nice.econt) {
                    var tt = Nice.econt[i];
                    if (tt.el === v) {
                        return tt;
                    }
                }
            })(el));
        }
    };
    lib.on = function (el, type, fn) {
        var c = Nice.etype[type];
        if (c) {
            c.dispatch(el);
        }
        el.addEventListener(type, fn, false);
        Nice.evStack(el, type, fn);
    };
    lib.delegate = function (el, type, fn) {
        var c = Nice.etype[type];
        if (c) {
            c.dispatch(document);
        }
        document.addEventListener(type, function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            return;
            if (e.target.closest(el, true)) {
                //监听成功,执行操作
                fn();
            }
        }, false);
        //Nice.evStack(el,type,fn);
    };
    lib.off = function (el, type, fn) {
        (function (o) {
            var tt = o.tt;
            if (type) {
                for (var i = 0; i < tt.arr.length; i++) {
                    var v = tt.arr[i];
                    if (v.type === type) {
                        if (fn && fn === v.fn) {
                            tt.el.removeEventListener(type, v.fn);
                        } else {
                            tt.el.removeEventListener(type, v.fn);
                        }
                        tt.arr.splice(i, 1);
                    }
                }
            } else {
                for (var i = 0; i < tt.arr.length; i++) {
                    var v = tt.arr[i];
                    tt.el.removeEventListener(v.type, v.fn);
                }
            }
            if (tt.arr.length === 0) {
                delete tt.arr;
            }
            if (!tt.arr || tt.arr.length === 0) {
                Nice.dcont.splice(o.ind, 1);
                delete(Nice.econt[o.id]);
                tt = null;
            }
        })((function (v) {
            for (var i in Nice.econt) {
                var tt = Nice.econt[i];
                if (tt.el === v) {
                    return {tt: tt, id: i, ind: Nice.dcont.getIndex(tt.el)};
                }
            }
        })(el));
    };
    //--------------------------------------------------------------------------------------------
    //-------------------------------------------Dom----------------------------------------------
    //--预加载图片
    lib.preloadImage=function(src,cb){
        var pic=new Image();
        pic.src=src;
        pic.onload = function(){
            cb&&cb();
        }
    };
    //--预加载多媒体
    lib.preloadMedia=function(type,src,cb){
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
            cb&&cb()
        }
    };
    //--获取url参数
    lib.getUrlval=function(name) {
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
    //--判断字符串是不是邮箱
    //--------------------------------------------------------------------------------------------
    //-------------------------------------------本地存储-----------------------------------------
    //--获取cookie
    lib.getCookie=function(c_name) {
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
    //--设置cookie
    lib.setCookie=function(c_name, value, expiredays) {
        var exdate = new Date()
        exdate.setDate(exdate.getDate() + expiredays)
        document.cookie = c_name + "=" + escape(value) +
            ((expiredays == null) ? "" : ";expires=" + exdate.toGMTString()) + ";path=/";
    }
    //--删除cookie
    lib.clearCookie=function(name) {
        setCookie(name, "", -1);
    }
    //--清除所有cookie
    lib.clearAllCookies=function(){
        var keys=document.cookie.match(/[^ =;]+(?=\=)/g);
        if (keys) {
            for (var i = keys.length; i--;)
                document.cookie=keys[i]+'=0;expires=' + new Date( 0).toUTCString()
        }
    }
    //--------------------------------------------------------------------------------------------
    //-------------------------------------------check--------------------------------------------
    //--邮箱检测
    lib.isEmail=function(str) {
        var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
        return reg.test(str);
    }
    //--验证座机
    lib.checkPhone=function(sPhone) {
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
    //--验证手机
    lib.checkMobile=function(sMobile) {
        if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test(sMobile))) {
            return false;
        } else {
            return true;
        }
    }
    //--验证身份证号
    lib.checkIDCard=function(sCard) {
        var reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
        if(reg.test(sCard) === false){
            return  false;
        }else{
            return true;
        }
    }
    //验证姓名
    lib.checkName=function(s,notChargeLen) {
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
    //--验证车牌号
    lib.checkCarPlate=function(s) {
        var reg = /(^[a-zA-Z]{1}(\d|[a-zA-Z]){5}$)/;
        if(reg.test(s) === false){
            return  false;
        }else{
            return true;
        }
    }
    //--验证固定位数或固定范围位数的字符或数字
    lib.checkLimitCode=function(str,type,min,max,arr){
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
        var reg=eval('\/(^['+t+']{'+(min?min:0)+','+(max?max:6)+'}$)\/');
        return reg.test(str);
    }
    //--获取元素绝对位置Left
    lib.getElementLeft=function(element) {
        var actualLeft = element.offsetLeft;
        var current = element.offsetParent;
        while (current !== null) {
            actualLeft += current.offsetLeft;
            current = current.offsetParent;
        }
        return actualLeft;
    }
    //--获取元素绝对位置Top
    lib.getElementTop=function(element) {
        var actualTop = element.offsetTop;
        var current = element.offsetParent;
        while (current !== null) {
            actualTop += current.offsetTop;
            current = current.offsetParent;
        }
        return actualTop;
    }
    //--是否在页面底部
    lib.isPageEnd=function(){
        if(oDocinfo&&oDocinfo.st+oDocinfo.ch+1>oDocinfo.sh){
            return true;
        }
        return false;
    }
    //--页面缩放式适配
    lib.responsiveScaling=function(){
        var DeviceWidth = window.screen.availWidth||window.screen.width;//先获取设备可用宽度
        var size=DeviceWidth/23;
        size=size>18?18:size;
        (document.documentElement||document.body.parentNode).style.fontSize=size+'px';
        document.body.style.fontSize=size+'px';
    }
    //--根据时间戳返回日期[和时间]
    lib.getLocalTime=function(nS,t,hasTime){
        //nS为时间戳，t代表分隔符(默认为.)，hasTime代表是否返回时间(默认true)
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
    //--------------------------------------------------------------------------------------------
    //-------------------------------------------js原生的拓展-------------------------------------
    //--js原生的拓展/Array
    _.extendPrototype(Array,{
        "indexOf":function(el){
            for (var i=0,n=this.length; i<n; i++){
                if (this[i] === el){
                    return i;
                }
            }
            return -1;
        }
    });
    //--js原生的拓展/String
    _.extendPrototype(String,{
        "trim":function(){
            //--去掉前后空格
            return this.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
        }
    });
    //--js原生的拓展/dom
    _.extendPrototype("dom",{
        getRect:function(){
            //--获取element相对于文档左上角的绝对位置信息和element的尺寸信息
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
        }
    });
    //输出：
    if(typeof exports!=='undefined'){
        if(typeof module!=='undefined'){
            exports=module.exports=lib;
        }else{
            exports.lib=lib;
        }
    }else{
        if(!root.Nice){
            root.Nice=new Function();
        }
        root._lib=root.Nice.lib=lib;
    }
    return _lib;
}).call(this,Nice);