/**
 * version:1.2.1
 * update:2016年7月6日 09:22:23
 * Created by jun.li on 2016/3/2.
 */
//js原生拓展
var Junb=function(){
    var self=this;
    var cont=self.cont=(function(){
        var c=document.getElementById('j-body');
        if(!c){
            c=document.createElement('div');
            c.id='j-body';
            c.setAttribute('data-version','1.0');
            c.setAttribute('data-name','Junb');
            document.body.appendChild(c);
        }
        return c;
    })();
    var pages=self.pages={};
    self.oVersion={//版本控制
        v:cont.getAttribute("data-version"),
        name:cont.getAttribute("data-name"),
        title:document.title
    }
    self.currPage=null;
    self.pFn={};//扩展页面私有执行函数。按页面id分配给各个页面
    self.exFn=[];//拓展公共渲染函数——渲染后
    self.preFn=[];//拓展公共渲染函数——渲染前
    self.plen=0;
    self.async=true;
    self.device=self.getDevice();
    self.hash=window.location.hash?window.location.hash.substr(1):"";
    self.dStr='';
    self.domCtl=(function(){
        if(document.head.querySelector('#__domRevManifest')){
            document.head.querySelector('#__domRevManifest').remove();
            return __domRevManifest;
        }else{
            return null;
        }
    })();
    self.extend=function(){
        if(arguments[0]=="pubPre"){
            self.preFn.push(arguments[1]);//拓展公共渲染函数——渲染前
        }else if(arguments[0]=="pub"){
            self.exFn.push(arguments[1]);//拓展公共渲染函数——渲染后
        }else{
            var lastPara=arguments[arguments.length-1];//传入的最后一个参数
            //扩展页面私有执行函数
            if(typeof lastPara==='function'){
                self.pFn[arguments[0]]=lastPara;
            }else if(typeof lastPara==='object'){
                self.pFn[arguments[0]]=arguments[arguments.length-2];
            }else{
                return;
            }
            var o={
                id:arguments[0],
                title:typeof arguments[1]==="string"?arguments[1]:self.oVersion.title,
                url:"dom/"+arguments[0]+".html"
            }
            pages[o.id]={
                0:null,
                url:o.url,
                id:o.id,
                title:o.title,
                loaded:false,
                hashSubcribe:{},
                sCateHash:"",
                opt:(function(){
                    if(typeof lastPara==='function'){return null;}
                    var r={};
                    if(lastPara.js&&lastPara.js.length!==0){
                        if(typeof lastPara.js[0]==='object'){
                            r.js={
                                pre:{loaded:false,arr:self.iniRes(lastPara.js[0])},
                                res:{loaded:false,arr:self.iniRes(lastPara.js.slice(1))}
                            }
                        }else{
                            r.js={
                                res:{loaded:false,arr:self.iniRes(lastPara.js)}
                            }
                        }
                    }
                    if(lastPara.style&&lastPara.style.length!==0){
                        r.style={
                            res:{loaded:false,arr:self.iniRes(lastPara.style)}
                        }
                    }
                    return r;
                })(),
                hide:function(){
                    Junb.removeClass(this[0],"on");
                },
                show:function(cateHash){
                    var t=this;
                    Junb.addClass(t[0],"on");
                    if(self.async){
                        //执行渲染前函数
                        if(self.preFn&&self.preFn.length!==0){
                            for(var i=0,len=self.preFn.length;i<len;i++){
                                self.preFn[i](t);
                            }
                        }
                        //执行模块函数
                        var f=self.pFn[t.id];
                        if(f){
                            //先执行页面自己的函数，再回调对页面进行编译
                            if(t.opt){
                                Junb.loadRes(!(t.opt.js&&t.opt.js.pre)||t.opt.js.pre,function(){
                                    f.call(t,function(){
                                        Junb.loadRes(!(t.opt.js&&t.opt.js.res)||t.opt.js.res,function(){
                                            self.compilePage(t);
                                        });
                                    });
                                });
                                !t.opt.style||Junb.loadRes(t.opt.style.res);
                            }else{
                                f.call(t,function(){
                                    self.compilePage(t);
                                });
                            }
                        }
                    }else{
                        self.async=true;
                    }
                    //如果有模块内子hash观察者，则执行该观察者
                    var hs=t.hashSubcribe;
                    if(hs){
                        for(var v in hs){
                            hs[v](cateHash[v]);
                        }
                        t.sCateHash=JSON.stringify(cateHash);
                    }
                }
            };
        }
    };
    self.listen=function(hash,fn){
        self.currPage.hashSubcribe[hash]=fn;
    };
    self.iniRes=function(res){
        var r=[];
        for(var i= 0,l=res.length;i<l;i++){
            r.push({
                0:(function(src){
                    if(self.domCtl&&!/:\/\//.test(src)){
                        var t=src.match(/\/\w*\./);
                        var cate=src.substr(src.lastIndexOf('\.')+1);
                        var c=src.substr(t['index']+1,t[0].length-2);
                        var s=self.domCtl[cate][c];
                        return src.replace(/\/\w*\./,'\/'+s+'\.');
                    }else{
                        return src;
                    }
                }(res[i])),
                loaded:false,
                dom:null
            });
        }
        return r;
    };
    self.iniPages=function(){
        //hash
        try{
            self.loadByHash();
        }catch(e){}
        //监听hash值改变
        window.addEventListener("hashchange",function(){
            self.hash=window.location.hash?window.location.hash.substr(1):"";
            self.loadByHash();
        },false);
        //data-href监听
        document.addEventListener('click',function(e){
            var v= e.target;
            p=v.closest('[data-href]',true);
            if(p){
                var href= p.getAttribute('data-href');
                var s=v.getAttribute("data-page-async");
                self.async=!(s==="false");//只要不是"false"，则返回true
                self.changeHash(href,self.async);
            }
        },false);
    };
    self.gotoPage=function(str){
        var arrHash=str.split("&");
        var cateHash={};
        if(arrHash.length!==1){
            for(var i=1;i<arrHash.length;i++){
                var v=arrHash[i].split('=');
                cateHash[v[0]]=v[1];
            }
        }
        if(self.currPage){
            if(self.currPage.id===arrHash[0]){
                if(self.currPage.id===str){
                    if(self.currPage.sCateHash===JSON.stringify(cateHash)){
                        return;
                    }
                }else{
                    self.async=false;
                }
            }
        }
        (function(){
            var t=pages[arrHash[0]];
            var tOld=self.currPage;
            if(!tOld||tOld.id!==t.id){
                self.currPage=t;
                if(self.device.plat!=="ios"){
                    document.title=self.currPage.title;
                }else{
                    //history.pushState(state, title, "http://www.baidu.com");
                }
                if(!t.loaded){
                    self.loadPage(t.id,function(data){
                        t[0]=self.createPage({
                            "data-page":t.id,
                            "data-page-title":t.title
                        });
                        t[0].innerHTML=data;
                        t.loaded=true;
                        self.forLoad(false);
                        self.currPage.show(cateHash);
                    });
                }else{
                    self.forLoad(true);
                    self.currPage.show(cateHash);
                }
            }else{
                self.forLoad(true);
                self.currPage.show(cateHash);
            }
            if(tOld){
                tOld.hide();
            }
        })();
    };
    self.loadPage=function(id,fn){
        Junb.ajax({
            //url:'html.php'+"?page="+id+"&v="+self.oVersion.v,
            url:'views/'+(self.domCtl?self.domCtl.dom[id]:id)+'.html'+(self.domCtl?'':'?v='+Junb.createRandomAlphaNum(5)),
            type:"get",
            dataType:"string",
            callback:function(data){
                fn(data);
            }
        });
    };
    self.loadByHash=function() {
        self.gotoPage(self.hash);
    }
    self.changeHash=function(resource,async){//改变hash值
        window.location.hash = resource;
        self.async=async===false?async:true;
    };
    self.createPage=function(o){
        var d=document.createElement("div");
        for(var i in o){
            d.setAttribute(i,o[i]);
        }
        d.className="junb-page";
        self.cont.appendChild(d);
        return d;
    };
    self.arrLine=[];
    self.forLoad=function(b){
        //传入参数b为currPage是否在列栈之中
        var t=self.currPage;
        var ar=self.arrLine;
        var mLen=5;
        if(b){
            for(var i=0;i<ar.length;i++){
                if(ar[i]===t.id){
                    ar.splice(i,1);
                }
            }
            ar.unshift(t.id);
        }else{
            ar.splice(0,0,t.id);
        }
        if(ar.length>mLen){
            for(var i=mLen;i<ar.length;i++){
                var v=self.pages[ar[i]];
                self.cont.removeChild(v[0]);
                v.loaded=false;
            }
            ar.splice(mLen);
        }
    };
    //页面渲染
    self.compilePage=function(t){
        //拓展每个页面都会执行的函数序列
        if(self.exFn&&self.exFn.length!==0){
            for(var key in self.exFn){
                self.exFn[key](t);
            }
        }
    };
    return self;
};
Junb.drag=function(target,isDelay){
    /*
     *拖拽，可延迟拖拽
     *paras:
     * 第一个参数为拖拽对象（或选择器）/dom对象或string/不可空
     * 第二个参数为是否弹性拖拽/boolean/可空
     * */
    var tar=typeof target=="string"?document.querySelector(target):target;
    var tarSize={
        w:~~(tar.offsetWidth/2),
        h:~~(tar.offsetHeight/2)
    };
    var reqAniId;
    var posRec={
        x:parseInt(tar.offsetLeft),
        y:parseInt(tar.offsetTop)
    }
    function dragTog(posTouch){
        var edge={
            ex:posTouch.x-posRec.x,
            ey:posTouch.y-posRec.y
        }
        var eStep;
        var bBase;
        eStep={sx:edge.ex/10,sy:edge.ey/10};
        bBase=edge.ex>edge.ey;
        cancelAnimationFrame(reqAniId);
        step(eStep,posTouch,bBase);
    }
    function step(eStep,posTouch,bBase){
        if(!isDelay){
            posRec.x=posTouch.x;
            posRec.y=posTouch.y;
            tar.style.left=posRec.x+"px";
            tar.style.top=posRec.y+"px";
            return;
        }
        if(!bBase){
            bEnd=Math.abs(posTouch.x-posRec.x)<Math.abs(eStep.sx);
        }else{
            bEnd=Math.abs(posTouch.y-posRec.y)<Math.abs(eStep.sy);
        }
        if(bEnd){
            posRec.x=posTouch.x;
            posRec.y=posTouch.y;
            tar.style.left=posRec.x+"px";
            tar.style.top=posRec.y+"px";
            return;
        }else{
            posRec.x+=eStep.sx;
            posRec.y+=eStep.sy;
            tar.style.left=posRec.x+"px";
            tar.style.top=posRec.y+"px";
        }
        reqAniId=requestAnimationFrame(function(){
            return step(eStep,posTouch,bBase);
        });
    }
    tar.addEventListener("touchstart",function(){
        tar.removeEventListener("touchmove",bindMove,false);
    },false);
    tar.addEventListener("touchend",function(){
        tar.removeEventListener("touchmove",bindMove,false);
    },false);
    var stv;
    function bindMove(e){
        if(!stv){
            if(!isDelay){
                var ev=e||window.event;
                var t=ev.touches[0];
                posTouch={
                    x: t.clientX-tarSize.w,
                    y: t.clientY-tarSize.h
                }
                dragTog(posTouch);
            }else{
                stv=setTimeout(function(){
                    var ev=e||window.event;
                    var t=ev.touches[0];
                    posTouch={
                        x: t.clientX-tarSize.w,
                        y: t.clientY-tarSize.h
                    }
                    requestAnimationFrame(function(){
                        return dragTog(posTouch);
                    });
                    clearTimeout(stv);
                    stv=undefined;
                },80);
            }
        }else{
        }
    }
};
Junb.ajax=function(o){
    /*
     *ajax，支持get和post
     *paras:
     * 对象o，属性如下：
     * url：请求地址，不可空
     * type：传输方式，默认为POST
     * callback：回调函数，可空，默认为function(){}
     * dataType：返回的参数类型，可空，json代表json对象，jsonp代表jsonp方式（这时需要传递一个jsonpBackName和jsonpBackName参数作为回调），string代表字符串.默认为json
     * paras：上传参数，可空，默认为""
     *
     * */
    var fun= o.callback||function(){};//回调函数，可空，默认为function(){}
    var paras= o.paras||"";//上传参数，可空，默认为""
    var type=o.type||"POST";//默认为POST
    var async=o.async!==false;//是否异步，默认为异步true
    var dataType=o.dataType||"json";
    var url= o.url;//请求地址，不可空
    if(dataType==="jsonp"){
        var jpn=(o.jsonpCallbackName||"callback");
        var jpb=o.jsonpCallback||"_"+new Date().getTime();
        url+=(o.url.indexOf("?")===-1?"?":"&")+jpn+"="+jpb;
        if(paras){
            for(var pr in paras){
                url+="&"+pr+"="+paras[pr];
            }
        }
        window[jpb]=fun;
        var s=document.createElement("script");
        s.src=url;
        s.onload=function(){
            document.head.removeChild(s);
            delete window[jpb];
        };
        document.head.insertBefore(s,document.head.childNodes[0]);
        return;
    }else{
        var xmlhttp;
        if (window.XMLHttpRequest){
            xmlhttp=new XMLHttpRequest();
        }else{
            xmlhttp=new ActiveXoect("Microsoft.XMLHTTP");
        }
        xmlhttp.onreadystatechange=function(){
            var r = null;
            if (xmlhttp.readyState==4 && xmlhttp.status==200 ){
                r=xmlhttp.responseText;
                if(dataType=="json"){
                    r=JSON.parse(r);
                }
                fun(r);
            }
        }
        if(type=="post"){
            var postStr=url.split('?')[1];
            postStr=postStr?postStr+'&':'';
            if((typeof paras)=="object"){
                for(var key in paras){
                    postStr+=key+'='+paras[key]+'&';
                }
                postStr=postStr.replace(/&$/,'');
            }else if((typeof paras)=="string"){
                postStr=paras;
            }
            xmlhttp.open("POST", url, async);
            xmlhttp.setRequestHeader("Content-type","application/x-www-form-urlencoded");
            xmlhttp.send(postStr);
        }else{
            var gets="";
            if(paras){
                var bool=(function(){
                    var b=false;
                    for(var pr in paras){
                        gets+="&"+pr+"="+paras[pr];
                        b=true;
                    }
                    return b;
                })();
                gets=bool?gets.substr(1):gets;
                url+=bool?(url.indexOf("?")===-1?"?":"&")+gets:"";
            }
            xmlhttp.open("GET",url,async);
            xmlhttp.send();
        }
        return xmlhttp;
    }
}
Junb.loadRes=function(o,fn){
    //js加载必须有fn，style加载可以没有fn
    if(o===true||o.loaded){
        return fn?fn():true;
    }
    var a= o.arr;
    if(/.js$/.test(a[0][0])){
        var i= 0,l= a.length;
        !function(){
            if(i>=l){
                o.loaded=true;
                return fn();
            }
            var cl=arguments.callee;
            var a_t=a[i++];
            if(a_t.loaded){
                return cl();
            }
            var d=document.createElement('script');
            d.src=a_t[0]+(self.domCtl?'':'?v='+Junb.createRandomAlphaNum(5));
            try{
                d.onload=function(){
                    a_t.loaded=true;
                    a_t.dom=this;
                    return cl();
                };
            }catch(e){
                console.error(e);
            }
            document.body.appendChild(d);
        }();
    }else if(/.css$/.test(a[0][0])){
        !function(){
            var l= a.length;
            var n=0;//已经加载完成的style数
            for(var i= 0;i<l;i++){
                if(a[i].loaded){
                    n++;
                    continue;
                }
                !function(i){
                    var d=document.createElement('link');
                    d.rel='stylesheet';
                    d.href=a[i][0]+(self.domCtl?'':'?v='+Junb.createRandomAlphaNum(5));
                    d.onload=function(){
                        a[i].loaded=true;
                        a[i].dom=d;
                        n++;
                        if(n>=l){
                            o.loaded=true;
                            return fn?fn():true;
                        }
                    };
                    document.head.appendChild(d);
                }(i);
            }
        }();
    }
};
Junb.addClass=function(element, _className){
    /*
     *添加className
     *paras:
     * element：element对象
     * _className：要添加的className
     *
     * */
    if(element instanceof Node){
        var support = document.body.classList==undefined ? false : true;
        if(support && element){
            element.classList.add(_className);
        }else{
            if(element && element instanceof Node){
                var cn = element.className;
                if(cn){
                    if( (" "+cn+" ").indexOf(" "+_className+" ")===-1 ){
                        element.className = cn+" "+_className;
                    }
                }else{
                    element.className = _className;
                }
            }
        }
    }
}
Junb.removeClass=function(element, _className){
    /*
     *移除className
     *paras:
     * element：element对象
     * _className：要移除的className
     *
     * */
    if(element instanceof Node){
        var support = document.body.classList==undefined ? false : true;
        if(support){
            element.classList.remove(_className);
        }else{
            if(element && element instanceof Node){
                var cn = " " + element.className + " ";
                var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                element.className = cn.replace(reg, ' ');
            }
        }
    }
}
Junb.toggleClass=function(element, _className){
    /*
     *有则移除，无则添加className
     *paras:
     * element：element对象
     * _className：要toggle的className
     *
     * */
    var that = this;
    if(element instanceof Node){
        var support = document.body.classList==undefined ? false : true;
        if(support){
            element.classList.toggle(_className);
        }else{
            if(that.hasClass(element, _className)){
                that.removeClass(element, _className);
            }else{
                that.addClass(element, _className);
            }
        }
    }
};
Junb.hasClass=function(element,_className){
    /*
     *检验是否含有某className
     *paras:
     * element：element对象
     * _className：要检测的className
     *
     * */
    if(!element.className){return false;}
    var c=' '+element.className+' ';
    var cls=' '+_className+' ';
    var arr=c.match(new RegExp(cls));
    return Boolean(arr)||false;
};
Junb.econt={};
Junb.dcont=[];
Junb.dcont=[];
Junb.etype={
    tap:{
        name:"tap",
        custom:new CustomEvent("tap",{
            detail:{
                message:"hallo event！",
                time:new Date()
            },
            bubbles:false,
            cancelable:true
        }),
        dispatch:function(el){
            console.log(el);
            var _self=this;
            var _t={};
            _t.fnSt=function(e){
                _t.isCli=true;
                el.addEventListener("touchmove",_t.fnMv,false);
                el.addEventListener("touchend",_t.fnEd,false);
            };
            el.addEventListener("touchstart",_t.fnSt,false);
            _t.fnMv=function(e){
                _t.isCli=false;
            };
            _t.fnEd=function(e){
                console.log(222);
                el.removeEventListener("touchmove",_t.fnMv,false);
                el.removeEventListener("touchend",_t.fnEd,false);
                if(_t.isCli){
                    el.dispatchEvent(_self.custom);
                }
            };
        }
    }
}
Junb.evStack=function(el,type,fn){
    var ind=Junb.dcont.getIndex(el);
    if(ind===-1){
        var s=Junb.createRandomAlphaNum(8);
        var tt=Junb.econt[s]={
            el:el,
            arr:[]
        };
        tt.arr.push({
            type:type,
            fn:fn
        });
        Junb.dcont.push(el);
    }else{
        (function(tt){
            tt.arr.push({
                type:type,
                fn:fn
            });
        })((function(v){
            for(var i in Junb.econt){
                var tt=Junb.econt[i];
                if(tt.el===v){
                    return tt;
                }
            }
        })(el));
    }
};
Junb.on=function(el,type,fn){
    var c=Junb.etype[type];
    if(c){
        c.dispatch(el);
    }
    el.addEventListener(type,fn,false);
    Junb.evStack(el,type,fn);
};
Junb.delegate=function(el,type,fn){
    var c=Junb.etype[type];
    if(c){
        c.dispatch(document);
    }
    document.addEventListener(type,function(event){
        var e=event||window.event||arguments.callee.caller.arguments[0];
        //console.log(e.target.closest);
        console.log(e.target);
        return;
        if(e.target.closest(el,true)){
            //监听成功,执行操作
            fn();
        }
    },false);
    //Junb.evStack(el,type,fn);
};
Junb.off=function(el,type,fn){
    (function(o){
        var tt=o.tt;
        if(type){
            for(var i=0;i<tt.arr.length;i++){
                var v=tt.arr[i];
                if(v.type===type){
                    if(fn&&fn===v.fn){
                        tt.el.removeEventListener(type,v.fn);
                    }else{
                        tt.el.removeEventListener(type,v.fn);
                    }
                    tt.arr.splice(i,1);
                }
            }
        }else{
            for(var i=0;i<tt.arr.length;i++){
                var v=tt.arr[i];
                tt.el.removeEventListener(v.type,v.fn);
            }
        }
        if(tt.arr.length===0){
            delete tt.arr;
        }
        if(!tt.arr||tt.arr.length===0){
            Junb.dcont.splice(o.ind,1);
            delete(Junb.econt[o.id]);
            tt=null;
        }
    })((function(v){
        for(var i in Junb.econt){
            var tt=Junb.econt[i];
            if(tt.el===v){
                return {tt:tt,id:i,ind:Junb.dcont.getIndex(tt.el)};
            }
        }
    })(el));
};
Junb.createRandomAlphaNum=function(len) {
    var rdmString = "";
    for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) {}
    return rdmString.substr(0, len);
};
Junb.prototype.getDevice=function(){
    /*
     * 设备检测
     * 浏览器js引擎版本和版本号检测
     * 浏览器类型检测
     * 平台检测：系统检测、移动设备类型检测、游戏系统检测
     *
     * */
    var client = function(){
        var engine = {
            ie: 0,
            gecko: 0,
            webkit: 0,
            khtml: 0,
            opera: 0,
            ver: null
        };

        var browser = {

            ie: 0,
            firefox: 0,
            safari: 0,
            konq: 0,
            opera: 0,
            chrome: 0,

            ver: null
        };


        //platform/device/OS
        var system = {
            win: false,
            mac: false,
            x11: false,

            //mobile devices
            iphone: false,
            ipod: false,
            ipad: false,
            ios: false,
            android: false,
            nokiaN: false,
            winMobile: false,

            //game systems
            wii: false,
            ps: false
        };

        var ua = navigator.userAgent;
        if (window.opera){
            engine.ver = browser.ver = window.opera.version();
            engine.opera = browser.opera = parseFloat(engine.ver);
        } else if (/AppleWebKit\/(\S+)/.test(ua)){
            engine.ver = RegExp["$1"];
            engine.webkit = parseFloat(engine.ver);

            if (/Chrome\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.chrome = parseFloat(browser.ver);
            } else if (/Version\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.safari = parseFloat(browser.ver);
            } else {
                var safariVersion = 1;
                if (engine.webkit < 100){
                    safariVersion = 1;
                } else if (engine.webkit < 312){
                    safariVersion = 1.2;
                } else if (engine.webkit < 412){
                    safariVersion = 1.3;
                } else {
                    safariVersion = 2;
                }

                browser.safari = browser.ver = safariVersion;
            }
        } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)){
            engine.ver = browser.ver = RegExp["$1"];
            engine.khtml = browser.konq = parseFloat(engine.ver);
        } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)){
            engine.ver = RegExp["$1"];
            engine.gecko = parseFloat(engine.ver);

            if (/Firefox\/(\S+)/.test(ua)){
                browser.ver = RegExp["$1"];
                browser.firefox = parseFloat(browser.ver);
            }
        } else if (/MSIE ([^;]+)/.test(ua)){
            engine.ver = browser.ver = RegExp["$1"];
            engine.ie = browser.ie = parseFloat(engine.ver);
        }

        browser.ie = engine.ie;
        browser.opera = engine.opera;


        var p = navigator.platform;
        system.win = p.indexOf("Win") == 0;
        system.mac = p.indexOf("Mac") == 0;
        system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

        if (system.win){
            if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)){
                if (RegExp["$1"] == "NT"){
                    switch(RegExp["$2"]){
                        case "5.0":
                            system.win = "2000";
                            break;
                        case "5.1":
                            system.win = "XP";
                            break;
                        case "6.0":
                            system.win = "Vista";
                            break;
                        case "6.1":
                            system.win = "7";
                            break;
                        default:
                            system.win = "NT";
                            break;
                    }
                } else if (RegExp["$1"] == "9x"){
                    system.win = "ME";
                } else {
                    system.win = RegExp["$1"];
                }
            }
        }

        system.iphone = ua.indexOf("iPhone") > -1;
        system.ipod = ua.indexOf("iPod") > -1;
        system.ipad = ua.indexOf("iPad") > -1;
        system.nokiaN = ua.indexOf("NokiaN") > -1;

        if (system.win == "CE"){
            system.winMobile = system.win;
        } else if (system.win == "Ph"){
            if(/Windows Phone OS (\d+.\d+)/.test(ua)){;
                system.win = "Phone";
                system.winMobile = parseFloat(RegExp["$1"]);
            }
        }

        if (system.mac && ua.indexOf("Mobile") > -1){
            if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)){
                system.ios = parseFloat(RegExp.$1.replace("_", "."));
            } else {
                system.ios = 2;  //can't really detect - so guess
            }
        }

        if (/Android (\d+\.\d+)/.test(ua)){
            system.android = parseFloat(RegExp.$1);
        }

        system.wii = ua.indexOf("Wii") > -1;
        system.ps = /playstation/i.test(ua);

        return {
            engine:     engine,
            browser:    browser,
            system:     system
        };

    }();
    var uPlat = false;
    var plat = false;
    var ua = navigator.userAgent.toLowerCase();
    var platV = false;
    var iphoneN = false;
    //初始化微信接口
    if(ua.indexOf("applewebkit") != -1){
        if(client.system.iphone || client.system.ipad){
            plat = "ios";
            if(ua.indexOf("6_") != -1){
                platV = 6.0;
            }
            if(ua.indexOf("7_") != -1){
                platV = 7.0;
            }
            if(ua.indexOf("8_") != -1){
                platV = 8.0;
            }
            if(ua.indexOf("8_0") != -1){
                platV = 8.0;
            }
            if(ua.indexOf("8_1") != -1){
                platV = 8.1;
            }
            if(ua.indexOf("8_2") != -1){
                platV = 8.2;
            }
            if(ua.indexOf("8_3") != -1){
                platV = 8.3;
            }
            if(ua.indexOf("8_4") != -1){
                platV = 8.4;
            }
            if(ua.indexOf("9_") != -1){
                platV = 9.0;
            }
            if(ua.indexOf("micromessenger") != -1){//微信浏览器
                uPlat = "ios_weixin";
            }else if(ua.indexOf("version") != -1 && ua.indexOf("safari") != -1){//Safair浏览器
                uPlat = "safari";
            }else{ //桌面快捷方式
                uPlat = "desktop";
            }
            var w = window.screen.width;
            var h = window.screen.height;
            if(h == 480){
                iphoneN = "iphone4";
            }
            if(h == 568){
                iphoneN = "iphone5";
            }
            if(h == 667){
                iphoneN = "iphone6";
            }
            if(h == 736){
                iphoneN = "iphone6p";
            }
        }else if(client.system.android){
            plat = "android";
            if(ua.indexOf("micromessenger") != -1){//微信浏览器
                uPlat = "android_weixin";
            }else if(ua.indexOf("chrome") != -1){//Chrome浏览器
                uPlat = "chrome";
            }
        }
    }
    return {
        ua:ua,
        platV:platV,
        plat:plat,
        iphoneN:iphoneN,
        uPlat:uPlat
    }
};
//原生拓展
Array.prototype.getIndex=function(v){
    for(var i=0;i<this.length;i++){
        if(this[i]===v){
            return i;
        }
    }
    return -1;
};
//Element原生拓展
HTMLElement.prototype.closest=function(s,contain){
    /*
     *获取符合条件的距离当前dom最近的祖辈元素
     *paras:
     * s：条件，可能为字符串,也可能是dom对象:
     * 若为字符串:#id .className tagName [属性名]
     * 若为dom对象:则直接进行向上比对
     * contain：是否包含当前元素（默认不包含，即从父元素开始查找）
     *
     * */
    var p=contain?this:this.parentNode;
    var isDom=typeof s==='object'||false;
    var __HTML=document.documentElement;
    var b=false;
    if(isDom){
        while(p!==__HTML){
            if(p===s){
                b=true;
                return p;
            }
            p=p.parentNode;
        }
    }else{
        var t=s.substr(0,1);
        var str='';
        if(t==='['){
            var ar=s.match(/[\w-_\d\.]+/g);
            str= ar[0];
            var strVal=ar[1]||null;
            var pVal='';
        }else{
            str= s.match(/[\w-_\d]+/g)[0];
        }
        while(p&&p!==__HTML){
            switch(t){
                case '#':
                    if(p.id===str){
                        b=true;
                        return p;
                    }
                    break;
                case '\.':
                    if(Junb.hasClass(p,str)){
                        b=true;
                        return p;
                    }
                    break;
                case '[':
                    pVal=p.getAttribute(str);
                    if(pVal&&(strVal===null||pVal===strVal)){
                        b=true;
                        return p;
                    }
                    break;
                default:
                    if(p.tagName===s){
                        b=true;
                        return p;
                    }
            }
            p= p.parentNode;
        }
    }
    return b?p:null;
};











