/**
 * version:
 * update:2016年10月8日14:52:36
 * tip:
 * 计划：
 * 分离为Junb.js分离为Nice-1.0.0js和Nice.lib-1.0.0.js，不再向上兼容
 * Nice释义：non-forcible(非强制性) ingenious(灵巧) conpatible(兼容并包) efficient(高效)
 * 二者完全独立，Nice.lib要求：满足AMD规范、原生，文件按功能区进行划分：原生函数拓展、表单区 Nice.Form（表单相关,如验证等）、UI区 Nice.UI（UI层）、
 * 应该允许合并views，可以将页面在index.html中定义页面，而非必须进行load加载因为某些小而精的页面不需要这样做，浪费dns
 * 应该优化hook，至于怎么优化，后续再定
 * 组件的加载和定义必须优化
 * 增加console.warn方便调试
 * 默认使用_作为代理关键字，但是允许设置其他关键字来代理，按时一旦Nice被占用，则直接报错
 * 更加规范，Nice和Nice.lib要符合AMD规范和js strict规范
 *
 * Created by jun.li on 2016/10/08.
 */
//Nice
(function () {
    var root = this;
    function _(){
        return new _.prototype.init();
    }
    _.prototype.init=function(){
        var me=this;
        this.cc=function(){
            var cc=11;
        };
        return me;
    };
    _.prototype.niceBone=function(){
        var me=this;
        var config=arguments[0]||{};
        me.maxPageCount=+config.maxPageCount||5;//允许的最大页面数量(不含static页面)
        me.test=config.test||null;//是否开启测试模式
        me.currPage = null;
        me.pFn = {};//扩展页面私有执行函数。按页面id分配给各个页面
        me.exFn = [];//拓展公共渲染函数——渲染后
        me.preFn = [];//拓展公共渲染函数——渲染前
        me.hFn = [];//拓展公共渲染函数——离开前
        me.hxFn = [];//拓展公共渲染函数——离开后
        me.beforeRender=null;//渲染之前，在preFn之前，即使sync为false，都需要执行
        me.plen = 0;
        me.sync = true;
        me.device = _.getDevice();
        me.hash = window.location.hash ? window.location.hash.substr(1) : "main";
        me.cateHash=null;//当前hash值对
        me.cateHash_=null;//上一个hash值对
        me.dStr = '';
        me.pages = {};
        me.temps={};
        me.arrLine = [];
        me.cont = (function () {
            var c = document.querySelector('bone');
            if (!c) {
                c = document.createElement('bone');
                c.setAttribute('nc-version', '1.0');
                c.setAttribute('nc-name', '_');
                document.body.appendChild(c);
            }
            return c;
        })();
        me.docTitle=(function(){
            var c = document.getElementById('nc-doc-title');
            if (!c) {
                c = document.createElement('div');
                document.body.appendChild(c);
            }
            c.style.position='absolute';
            c.id='nc-doc-title';
            c.style.width='1px';
            c.style.height='1px';
            c.style.opacity='0';
            return c;
        })();
        me.oVersion = {//版本控制
            v: me.cont.getAttribute("nc-version"),
            name: me.cont.getAttribute("nc-name"),
            title: document.title
        };
        me.domCtl = (function () {
            if (document.head.querySelector('#__domRevManifest')) {
                document.head.querySelector('#__domRevManifest').remove();
                return __domRevManifest;
            } else {
                return null;
            }
        })();
        return me;
    };
    _.create = function () {
        var self = new _.prototype.niceBone();
        var pages = self.pages=(function(){
            var ps=self.cont.querySelectorAll('page');
            var v={};
            if(ps.length===0){
                return {};
            }else{
                self.staticPageCount=ps.length;
                for(var i=0;i<self.staticPageCount;i++){
                    v=ps[i];
                    self.pages[v.getAttribute('nc-name')]={
                        id: v.getAttribute('nc-name'),
                        title:v.getAttribute('nc-title')||self.oVersion.title,
                        0:v,
                        static:true
                    };
                }
                return self.pages;
            }
        })();
        var cont = self.cont;
        self.extendBeforeShow=function(fn){
            self.preFn.push(fn);//拓展公共渲染函数——显示前
        };
        self.extendAfterShow=function(fn){
            self.exFn.push(fn);//拓展公共渲染函数——显示后
        };
        self.extendBeforeRender=function(fn){
            self.beforeRender=fn;//拓展公共渲染函数——渲染前
        };
        self.extendBeforeHide=function(fn){
            self.hFn.push(fn);//拓展公共渲染函数——离开前
        };
        self.extendAfterHide=function(fn){
            self.hxFn.push(fn);//拓展公共渲染函数——离开后
        };
        self.template=function(temp_id,fn){//公用模板
            self.temps[temp_id]={
                0:(function(){
                    self.cont_temp=(function(){
                        var c = document.getElementById('nc-component');
                        if (!c) {
                            c = document.createElement('div');
                            c.id = 'nc-component';
                            document.body.appendChild(c);
                        }
                        return c;
                    }());
                })(),
                id:temp_id,
                loaded:false,
                cb:fn,
                hide: function () {
                    _.removeClass(this[0], "on");
                    for(var i= 0,len=self.temps.length;i<len;i++){
                        var v=self.temps[i][0];
                        if(_.hasClass(v,'on')){
                            return;
                        }
                    }
                    _.removeClass(self.cont_temp, "on");
                },
                show:function(){
                    var t=this;
                    if(this.loaded){
                        _.addClass(self.cont_temp, "on");
                        _.addClass(t[0], "on");
                        //执行模块函数
                        this.cb(function(){
                            self.compilePage(t);
                        });
                    }else{//执行渲染前函数
                        self.loadPage(this.id, function (data) {
                            t[0] = self.createPage({
                                "data-temp": t.id
                            },true);
                            t.html=data;
                            t[0].innerHTML = data;
                            t.loaded = true;
                            t.show();
                        });
                    }
                }
            };
        };
        self.extend = function () {
            //传入的参数如果为Object，则对象包含如下参数
            //id:page id
            //id:page title
            //res:{style:[],js:[]}
            //beforeShow:
            //afterShow:
            //beforeHide:
            //afterHide:
            //传入的参数如果不为Object，则包含如下参数
            //page id [,page title],afterShow,{style:[],js:[]}
            var o={};
            if (typeof arguments[0]==='object') {
                console.log(o);
                o=arguments[0];
                self.pFn[o.id]={};
                self.pFn[o.id].init = o.init;
                self.pFn[o.id].beforeShow = o.beforeShow;
                self.pFn[o.id].afterShow = o.afterShow;
                self.pFn[o.id].beforeHide = o.beforeHide;
                self.pFn[o.id].afterHide = o.afterHide;
                self.pFn[o.id].unload = o.unload;
                o.title=o.title||self.oVersion.title;
                o.res=o.res||null;
            }else{
                var lastPara = arguments[arguments.length - 1];//传入的最后一个参数
                o = {
                    id: arguments[0],
                    title:typeof arguments[1] === "string" ? arguments[1] : self.oVersion.title,
                    res:typeof lastPara === 'function'?null:lastPara
                };
                self.pFn[o.id]={};
                //扩展页面私有执行函数
                if (typeof lastPara === 'function') {
                    self.pFn[o.id].afterShow = lastPara;
                } else if (typeof lastPara === 'object') {
                    self.pFn[o.id].afterShow = arguments[arguments.length - 2];
                } else {
                    self.pFn[o.id].afterShow=function(){};
                }
            }
            var cp=self.pages[o.id];
            if(!cp){
                cp=self.pages[o.id]={
                    id:o.id,
                    title:o.title
                };
            }else if(cp.static){
                cp.title=cp.title||o.title;
            }else{
                console.warn('multiplely init page pages['+o.id+']!');
            }
            cp.loaded=false;
            cp.hooks=[];
            cp.opt=(function () {
                if (!o.res) {
                    return null;
                }
                var r = {};
                if (o.res.js && o.res.js.length !== 0) {
                    if (typeof o.res.js[0] === 'object') {
                        r.js = {
                            pre: {loaded: false, arr: self.iniRes(o.res.js[0])},
                            res: {loaded: false, arr: self.iniRes(o.res.js.slice(1))}
                        }
                    } else {
                        r.js = {
                            res: {loaded: false, arr: self.iniRes(o.res.js)}
                        }
                    }
                }
                if (o.res.style && o.res.style.length !== 0) {
                    r.style = {
                        res: {loaded: false, arr: self.iniRes(o.res.style)}
                    }
                }
                return r;
            })();
            cp.hide=function () {
                var f = self.pFn[this.id];
                f.beforeHide&&f.beforeHide(this);
                _.conductFunctions.call(null,self.hFn,this);
                _.removeClass(this[0], "on");
                f.afterHide&&f.afterHide(this);
                _.conductFunctions.call(null,self.hxFn,this);
            };
            cp.show=function () {
                var f = self.pFn[this.id];
                f.beforeShow&&f.beforeShow(this);
                _.addClass(this[0], "on");
                self.beforeRender&&self.beforeRender(this);
                if (self.sync) {
                    this.render();
                } else {
                    self.sync = true;
                }
            };
            cp.render=function(){
                var t = this;
                var f = self.pFn[t.id];
                //执行渲染前函数
                _.conductFunctions.call(null,self.preFn,t);
                //执行模块函数
                if (f.afterShow) {
                    //先执行页面自己的函数，再回调对页面进行编译
                    if (t.opt) {
                        self.loadRes(!(t.opt.js && t.opt.js.pre) || t.opt.js.pre, function () {
                            f.afterShow.call(t,function () {
                                self.loadRes(!(t.opt.js && t.opt.js.res) || t.opt.js.res, function () {
                                    self.compileHook(t);
                                    self.compilePage(t);
                                });
                            },t);
                        });
                        !t.opt.style || self.loadRes(t.opt.style.res);
                    } else {
                        f.afterShow&&f.afterShow.call(t,function () {
                            self.compileHook(t);
                            self.compilePage(t);
                        },t);
                    }
                }
            };
            cp.restore=function(){
                this[0].innerHTML=this.html;
                this.render();
            };
            cp.hook=function(cb){//为函数添加钩子
                this.hooks.push(cb);
            };
        };
        self.iniRes = function (res) {
            var r = [];
            for (var i = 0, l = res.length; i < l; i++) {
                r.push({
                    0: (function (src) {
                        if (self.domCtl && !/:\/\//.test(src)) {
                            var t = src.match(/\/\w*\./);
                            var cate = src.substr(src.lastIndexOf('\.') + 1);
                            var c = src.substr(t['index'] + 1, t[0].length - 2);
                            var s = self.domCtl[cate][c];
                            return src.replace(/\/\w*\./, '\/' + s + '\.');
                        } else {
                            return src;
                        }
                    }(res[i])),
                    loaded: false,
                    dom: null
                });
            }
            return r;
        };
        self.setTitle=function (text) {
            if (self.device.plat !== "ios") {
                document.title = text;
            } else {
                document.title = text;
                var fr=document.createElement('iframe');
                fr.setAttribute('src',"images/x.png");
                fr.onload=function(){
                    setTimeout(function () {
                        self.docTitle.removeChild(fr);
                    });
                };
                self.docTitle.appendChild(fr);
            }
        };
        self.iniPages = function () {
            //hash
            try {
                self.loadByHash();
            } catch (e) {
            }
            //监听hash值改变
            window.addEventListener("hashchange", function () {
                self.hash = window.location.hash ? window.location.hash.substr(1) : "main";
                self.loadByHash();
            }, false);
            //nc-href监听
            document.addEventListener('click', function (e) {
                var v = e.target;
                p = v.closest('[nc-href]', true);
                if (p) {
                    var href = p.getAttribute('nc-href');
                    var s = p.getAttribute("sync");
                    self.sync = (s !== "false");//只要不是"false"，则返回true
                    self.changeHash(href, self.sync);
                }
            }, false);
        };
        self.gotoPage = function (str) {
            var arrHash = str.split("\/");
            var cateHash = {};
            cateHash['v']=(function(){
                return arrHash[0].split('=')[1]||arrHash[0].split('=')[0];
            })();
            for (var i = 1; i < arrHash.length; i++) {
                var v = arrHash[i].split('=');
                cateHash[v[0]] = v[1];
            }
            self.cateHash_=self.cateHash;
            self.cateHash=cateHash;
            var setPage=function(data){
                var t = pages[self.cateHash['v']];
                var tOld = self.currPage;
                if (!tOld || tOld.id !== t.id) {//发生了页面跳转
                    self.currPage = t;
                    self.setTitle(self.currPage.title);
                    if (!t.loaded) {
                        if(!t.static){
                            //创建页面
                            t[0] = self.createPage({
                                "nc-name": t.id,
                                "nc-title": t.title
                            });
                            t.html={html:data};
                            t[0].innerHTML = data;
                        }else{
                            t.html={html:t[0].innerHTML};
                            self.extend(self.cateHash['v'],function(cc){cc();});
                        }
                        t.loaded = true;
                        self.pFn[t.id].init&&self.pFn[t.id].init(t);
                        self.currPage.show(self.cateHash);
                    } else {
                        self.currPage.show(self.cateHash);
                    }
                } else {
                    self.currPage.show(self.cateHash);
                }
                if (tOld&&tOld!=t) {
                    tOld.hide();
                }
                self.forLoad(true);
            };
            !function(){
                var t=self.pages[self.cateHash['v']];
                if(t&&t.static||t&&t.html){//已经加载进来的或static页面
                    setPage();
                }else{//未加载进来的且非static
                    self.loadPage(self.cateHash['v'],function(data){
                        if(!t){
                            self.extend(self.cateHash['v'],function(cc){cc();});
                        }
                        setPage(data);
                    });
                }
            }();
            // if(!self.pages[self.cateHash['v']]||!self.pages[self.cateHash['v']].html){//未加载进来的非static
            //     self.loadPage(self.cateHash['v'],function(data){
            //         self.extend(self.cateHash['v'],function(cc){cc();});
            //         setPage(data);
            //     });
            // }else{//已经加载进来的或static页面
            //     setPage();
            // }
        };
        self.loadPage = function (id, fn) {
            var url='views/' + (self.domCtl ? self.domCtl.views[id] : id) + '.html' + (self.test ? '?v=' + _.createRandomAlphaNum(5):'');
            _.ajax({
                //url:'html.php'+"?page="+id+"&v="+self.oVersion.v,
                url: url,
                type: "get",
                dataType: "string",
                callback: function (data) {
                    fn(data);
                }
            });
        };
        self.loadRes = function (o, fn) {
            //js加载必须有fn，style加载可以没有fn
            if (o === true || o.loaded) {
                return fn ? fn() : true;
            }
            var a = o.arr;
            if (/.js$/.test(a[0][0])) {
                var i = 0, l = a.length;
                !function () {
                    if (i >= l) {
                        o.loaded = true;
                        return fn();
                    }
                    var cl = arguments.callee;
                    var a_t = a[i++];
                    if (a_t.loaded) {
                        return cl();
                    }
                    var d = document.createElement('script');
                    d.src = a_t[0] + (self.domCtl ? '' : (self.test ? '?v=' + _.createRandomAlphaNum(5):''));
                    try {
                        d.onload = function () {
                            a_t.loaded = true;
                            a_t.dom = this;
                            return cl();
                        };
                    } catch (e) {
                        console.error(e);
                    }
                    document.body.appendChild(d);
                }();
            } else if (/.css$/.test(a[0][0])) {
                !function () {
                    var l = a.length;
                    var n = 0;//已经加载完成的style数
                    for (var i = 0; i < l; i++) {
                        if (a[i].loaded) {
                            n++;
                            continue;
                        }
                        !function (i) {
                            var d = document.createElement('link');
                            d.rel = 'stylesheet';
                            d.href = a[i][0] + (self.domCtl ? '' : '?v=' + _.createRandomAlphaNum(5));
                            d.onload = function () {
                                a[i].loaded = true;
                                a[i].dom = d;
                                n++;
                                if (n >= l) {
                                    o.loaded = true;
                                    return fn ? fn() : true;
                                }
                            };
                            document.head.appendChild(d);
                        }(i);
                    }
                }();
            }
        };
        self.loadByHash = function () {
            self.gotoPage(self.hash);
        };
        self.changeHash = function (href, sync) {//改变hash值
            var resource=(function(){
                if(/^\-/.test(href)){//-xxx 减hash参数
                    var d=href.substr(1);
                    var exp = new RegExp('\/'+d+'='+self.cateHash[d],'');
                    href=self.hash.replace(exp,'');
                }else if(/^\+/.test(href)){//+xxx 增hash参数
                    href=self.hash+'\/'+href.substr(1);
                }else if(/^\^/.test(href)){//^xxx 替换hash参数
                    var d=href.substr(1).split('\=');
                    if(self.cateHash[d[0]]){//如果有该参数则替换其值
                        var exp = new RegExp('\/'+d[0]+'='+self.cateHash[d[0]]);
                        href=self.hash.replace(exp,'\/'+d[0]+'='+d[1]);
                    }else{//如果没有该参数则添加该参数
                        href=self.hash+'\/'+d[0]+'='+d[1];
                    }
                }
                return href;
            })();

            window.location.hash = resource;
            self.sync = sync === false ? sync : true;
        };
        self.createPage = function (o,isTemp) {//第二个参数表示是否是添加模板
            var d = document.createElement("page");
            for (var i in o) {
                d.setAttribute(i, o[i]);
            }
            //d.className = isTemp?"nc-temp":"nc-page";
            self[isTemp?'cont_temp':'cont'].appendChild(d);
            return d;
        };
        self.forLoad = function (b) {
            if(self.currPage.static){return;}
            //传入参数b为currPage是否在列栈之中
            var t = self.currPage;
            var ar = self.arrLine;
            if (b) {
                for (var i = 0; i < ar.length; i++) {
                    if (ar[i] === t.id) {
                        ar.splice(i, 1);
                    }
                }
                ar.unshift(t.id);
            } else {
                ar.splice(0, 0, t.id);
            }
            if (ar.length > self.maxPageCount) {
                for (var j = self.maxPageCount; j < ar.length; j++) {
                    var v = self.pages[ar[j]];
                    v.unload&&v.unload(v);
                    self.cont.removeChild(v[0]);
                    v.loaded = false;
                }
                ar.splice(self.maxPageCount);
            }
        };
        //执行钩子函数
        self.compileHook = function (t) {
            //拓展每个页面都会执行的函数序列
            if (t.hooks.length!==0) {
                for (var i=0;i<t.hooks.length;i++) {
                    t.hooks[i](t);
                }
            }
        };
        //页面渲染
        self.compilePage = function (t) {
            var t=t||self.currPage;
            if(t[0].tagName==='PAGE'){
                _.addClass(t[0],'ready');
            }
            //拓展每个页面都会执行的函数序列
            _.conductFunctions.call(null,self.exFn,t);
        };
        setTimeout(function(){
            self.iniPages();
        });
        return self;
    };
    //按顺序执行多个函数
    _.conductFunctions=function(funs,t){
        if(typeof funs==="function"){
            funs(t);
        }else if (funs.length !== 0) {
            for (var i = 0, len = funs.length; i < len; i++) {
                funs[i](t);
            }
        }
    };
    _.ajax = function (o) {
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
        var fun = o.callback || function () {};//回调函数，可空，默认为function(){}
        var paras = o.paras || "";//上传参数，可空，默认为""
        var type = o.type || "POST";//默认为POST
        var async = o.async !== false;//是否异步，默认为异步true
        var dataType = o.dataType || "json";
        var url = o.url;//请求地址，不可空
        if (dataType === "jsonp") {
            var jpn = (o.jsonpCallbackName || "callback");
            var jpb = o.jsonpCallback || "_" + new Date().getTime();
            url += (o.url.indexOf("?") === -1 ? "?" : "&") + jpn + "=" + jpb;
            if (paras) {
                for (var pr in paras) {
                    url += "&" + pr + "=" + paras[pr];
                }
            }
            window[jpb] = fun;
            var s = document.createElement("script");
            s.src = url;
            s.onload = function () {
                document.head.removeChild(s);
                delete window[jpb];
            };
            document.head.insertBefore(s, document.head.childNodes[0]);
            return;
        } else {
            var xmlhttp;
            if (window.XMLHttpRequest) {
                xmlhttp = new XMLHttpRequest();
            } else {
                xmlhttp = new ActiveXoect("Microsoft.XMLHTTP");
            }
            xmlhttp.onreadystatechange = function () {
                var r = null;
                if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
                    r = xmlhttp.responseText;
                    if (dataType == "json") {
                        r = JSON.parse(r);
                    }
                    fun(r);
                }
            }
            if (type == "post") {
                var postStr='';
                //var postStr = url.split('?')[1];
                //postStr = postStr ? postStr + '&' : '';
                if ((typeof paras) == "object") {
                    for (var key in paras) {
                        postStr += key + '=' + paras[key] + '&';
                    }
                    postStr = postStr.replace(/&$/, '');
                } else if ((typeof paras) == "string") {
                    postStr = paras;
                }
                xmlhttp.open("POST", url, async);
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send(postStr);
            } else {
                var gets = "";
                if (paras) {
                    var bool = (function () {
                        var b = false;
                        for (var pr in paras) {
                            gets += "&" + pr + "=" + paras[pr];
                            b = true;
                        }
                        return b;
                    })();
                    gets = bool ? gets.substr(1) : gets;
                    url += bool ? (url.indexOf("?") === -1 ? "?" : "&") + gets : "";
                }
                xmlhttp.open("GET", url, async);
                xmlhttp.send();
            }
            return xmlhttp;
        }
    };
    _.addClass = function (element, _className) {
        /*
         *添加className
         *paras:
         * element：element对象
         * _className：要添加的className
         *
         * */
        if (element instanceof Node) {
            var support = document.body.classList == undefined ? false : true;
            if (support && element) {
                element.classList.add(_className);
            } else {
                if (element && element instanceof Node) {
                    var cn = element.className;
                    if (cn) {
                        if ((" " + cn + " ").indexOf(" " + _className + " ") === -1) {
                            element.className = cn + " " + _className;
                        }
                    } else {
                        element.className = _className;
                    }
                }
            }
        }
    };
    _.removeClass = function (element, _className) {
        /*
         *移除className
         *paras:
         * element：element对象
         * _className：要移除的className
         *
         * */
        if (element instanceof Node) {
            var support = document.body.classList == undefined ? false : true;
            if (support) {
                element.classList.remove(_className);
            } else {
                if (element && element instanceof Node) {
                    var cn = " " + element.className + " ";
                    var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
                    element.className = cn.replace(reg, ' ');
                }
            }
        }
    };
    _.toggleClass = function (element, _className) {
        /*
         *有则移除，无则添加className
         *paras:
         * element：element对象
         * _className：要toggle的className
         *
         * */
        var that = this;
        if (element instanceof Node) {
            var support = document.body.classList == undefined ? false : true;
            if (support) {
                element.classList.toggle(_className);
            } else {
                if (that.hasClass(element, _className)) {
                    that.removeClass(element, _className);
                } else {
                    that.addClass(element, _className);
                }
            }
        }
    };
    _.hasClass = function (element, _className) {
        /*
         *检验是否含有某className
         *paras:
         * element：element对象
         * _className：要检测的className
         *
         * */
        if (!element.className) {
            return false;
        }
        var c = ' ' + element.className + ' ';
        var cls = ' ' + _className + ' ';
        var arr = c.match(new RegExp(cls));
        return Boolean(arr) || false;
    };
    _.createRandomAlphaNum = function (len) {
        var rdmString = "";
        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2)) {
        }
        return rdmString.substr(0, len);
    };
    _.getDevice = function () {
        /*
         * 设备检测
         * 浏览器js引擎版本和版本号检测
         * 浏览器类型检测
         * 平台检测：系统检测、移动设备类型检测、游戏系统检测
         *
         * */
        var client = function () {
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
            if (window.opera) {
                engine.ver = browser.ver = window.opera.version();
                engine.opera = browser.opera = parseFloat(engine.ver);
            } else if (/AppleWebKit\/(\S+)/.test(ua)) {
                engine.ver = RegExp["$1"];
                engine.webkit = parseFloat(engine.ver);

                if (/Chrome\/(\S+)/.test(ua)) {
                    browser.ver = RegExp["$1"];
                    browser.chrome = parseFloat(browser.ver);
                } else if (/Version\/(\S+)/.test(ua)) {
                    browser.ver = RegExp["$1"];
                    browser.safari = parseFloat(browser.ver);
                } else {
                    var safariVersion = 1;
                    if (engine.webkit < 100) {
                        safariVersion = 1;
                    } else if (engine.webkit < 312) {
                        safariVersion = 1.2;
                    } else if (engine.webkit < 412) {
                        safariVersion = 1.3;
                    } else {
                        safariVersion = 2;
                    }

                    browser.safari = browser.ver = safariVersion;
                }
            } else if (/KHTML\/(\S+)/.test(ua) || /Konqueror\/([^;]+)/.test(ua)) {
                engine.ver = browser.ver = RegExp["$1"];
                engine.khtml = browser.konq = parseFloat(engine.ver);
            } else if (/rv:([^\)]+)\) Gecko\/\d{8}/.test(ua)) {
                engine.ver = RegExp["$1"];
                engine.gecko = parseFloat(engine.ver);

                if (/Firefox\/(\S+)/.test(ua)) {
                    browser.ver = RegExp["$1"];
                    browser.firefox = parseFloat(browser.ver);
                }
            } else if (/MSIE ([^;]+)/.test(ua)) {
                engine.ver = browser.ver = RegExp["$1"];
                engine.ie = browser.ie = parseFloat(engine.ver);
            }

            browser.ie = engine.ie;
            browser.opera = engine.opera;


            var p = navigator.platform;
            system.win = p.indexOf("Win") == 0;
            system.mac = p.indexOf("Mac") == 0;
            system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);

            if (system.win) {
                if (/Win(?:dows )?([^do]{2})\s?(\d+\.\d+)?/.test(ua)) {
                    if (RegExp["$1"] == "NT") {
                        switch (RegExp["$2"]) {
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
                    } else if (RegExp["$1"] == "9x") {
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

            if (system.win == "CE") {
                system.winMobile = system.win;
            } else if (system.win == "Ph") {
                if (/Windows Phone OS (\d+.\d+)/.test(ua)) {
                    ;
                    system.win = "Phone";
                    system.winMobile = parseFloat(RegExp["$1"]);
                }
            }

            if (system.mac && ua.indexOf("Mobile") > -1) {
                if (/CPU (?:iPhone )?OS (\d+_\d+)/.test(ua)) {
                    system.ios = parseFloat(RegExp.$1.replace("_", "."));
                } else {
                    system.ios = 2;  //can't really detect - so guess
                }
            }

            if (/Android (\d+\.\d+)/.test(ua)) {
                system.android = parseFloat(RegExp.$1);
            }

            system.wii = ua.indexOf("Wii") > -1;
            system.ps = /playstation/i.test(ua);

            return {
                engine: engine,
                browser: browser,
                system: system
            };

        }();
        var uPlat = false;
        var plat = false;
        var ua = navigator.userAgent.toLowerCase();
        var platV = false;
        var iphoneN = false;
        //初始化微信接口
        if (ua.indexOf("applewebkit") != -1) {
            if (client.system.iphone || client.system.ipad) {
                plat = "ios";
                if (ua.indexOf("6_") != -1) {
                    platV = 6.0;
                }
                if (ua.indexOf("7_") != -1) {
                    platV = 7.0;
                }
                if (ua.indexOf("8_") != -1) {
                    platV = 8.0;
                }
                if (ua.indexOf("8_0") != -1) {
                    platV = 8.0;
                }
                if (ua.indexOf("8_1") != -1) {
                    platV = 8.1;
                }
                if (ua.indexOf("8_2") != -1) {
                    platV = 8.2;
                }
                if (ua.indexOf("8_3") != -1) {
                    platV = 8.3;
                }
                if (ua.indexOf("8_4") != -1) {
                    platV = 8.4;
                }
                if (ua.indexOf("9_") != -1) {
                    platV = 9.0;
                }
                if (ua.indexOf("micromessenger") != -1) {//微信浏览器
                    uPlat = "ios_weixin";
                } else if (ua.indexOf("version") != -1 && ua.indexOf("safari") != -1) {//Safair浏览器
                    uPlat = "safari";
                } else { //桌面快捷方式
                    uPlat = "desktop";
                }
                var w = window.screen.width;
                var h = window.screen.height;
                if (h == 480) {
                    iphoneN = "iphone4";
                }
                if (h == 568) {
                    iphoneN = "iphone5";
                }
                if (h == 667) {
                    iphoneN = "iphone6";
                }
                if (h == 736) {
                    iphoneN = "iphone6p";
                }
            } else if (client.system.android) {
                plat = "android";
                if (ua.indexOf("micromessenger") != -1) {//微信浏览器
                    uPlat = "android_weixin";
                } else if (ua.indexOf("chrome") != -1) {//Chrome浏览器
                    uPlat = "chrome";
                }
            }
        }
        return {
            ua: ua,
            platV: platV,
            plat: plat,
            iphoneN: iphoneN,
            uPlat: uPlat
        }
    };
    _.noConflict=function(){
        delete root._;
        return _;
    };
    _.useKey=function(s){
        root[s]=_;
        return _;
    };
    _.use=function(){
        var o=arguments[0];
        if(typeof o==='object'){
            //????????????????????????????????????????????????????????????????????????
            //待完善
            //????????????????????????????????????????????????????????????????????????
        }
    };
    _.extendPrototype=function(){
        var sel=arguments[0];
        var pr=null;
        if(typeof sel==='string'){
            sel=sel.toLowerCase();
            switch(sel){
                case 'string':
                    pr=String.prototype;
                    break;
                case 'number':
                    pr=Number.prototype;
                    break;
                case 'array':
                    pr=Array.prototype;
                    break;
                case 'object':
                    pr=Object.prototype;
                    break;
                case 'dom':
                    pr=HTMLElement.prototype;
                    break;
            }
        }else{
            if(sel&&sel.prototype){
                pr=sel.prototype;
            }
        }
        if(arguments.length===2&&(typeof arguments[1]==='object')){
            var ext=arguments[1];
            for(var k in ext){
                _.todoExtendPrototype(pr,ext[k]);
            }
        }else if(arguments.length===3){
            _.todoExtendPrototype(pr,arguments[1],arguments[2]);
        }
    };
    _.todoExtendPrototype=function(pr,str,fn){
        pr[str]=fn;
    };
    //原生拓展
    Array.prototype.getIndex = function (v) {
        for (var i = 0; i < this.length; i++) {
            if (this[i] === v) {
                return i;
            }
        }
        return -1;
    };
    //Element原生拓展
    HTMLElement.prototype.closest = function (s, contain) {
        /*
         *获取符合条件的距离当前dom最近的祖辈元素
         *paras:
         * s：条件，可能为字符串,也可能是dom对象:
         * 若为字符串:#id .className tagName [属性名]
         * 若为dom对象:则直接进行向上比对
         * contain：是否包含当前元素（默认不包含，即从父元素开始查找）
         *
         * */
        var p = contain ? this : this.parentNode;
        var isDom = typeof s === 'object' || false;
        var __HTML = document.documentElement;
        var b = false;
        if (isDom) {
            while (p !== __HTML) {
                if (p === s) {
                    b = true;
                    return p;
                }
                p = p.parentNode;
            }
        } else {
            var t = s.substr(0, 1);
            var str = '';
            if (t === '[') {
                var ar = s.match(/[\w-_\d\.]+/g);
                str = ar[0];
                var strVal = ar[1] || null;
                var pVal = '';
            } else {
                str = s.match(/[\w-_\d]+/g)[0];
            }
            while (p && p !== __HTML) {
                switch (t) {
                    case '#':
                        if (p.id === str) {
                            b = true;
                            return p;
                        }
                        break;
                    case '\.':
                        if (_.hasClass(p, str)) {
                            b = true;
                            return p;
                        }
                        break;
                    case '[':
                        pVal = p.getAttribute(str);
                        if (pVal && (strVal === null || pVal === strVal)) {
                            b = true;
                            return p;
                        }
                        break;
                    default:
                        if (p.tagName === s) {
                            b = true;
                            return p;
                        }
                }
                p = p.parentNode;
            }
        }
        return b ? p : null;
    };
    //输出：
    if (typeof exports !== 'undefined') {
        if (typeof module !== 'undefined' && module.exports) {
            exports = module.exports = _;
        }
        exports._ = _;
    } else {
        root._ = root.Nice = _;
    }
    return _;
}).call(this);










