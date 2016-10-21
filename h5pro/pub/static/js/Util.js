function isFunction(value) { return toString.call(value) == "[object Function]" }
function isObject(value) { return value instanceof Object }
function isArray(value) { return value instanceof Array }
function likeArray(obj) { return typeof obj.length == 'number' }

/*mozRequestAnimationFrame()解决了浏览器不知道Javascript动画正在执行和不知道多少才是合适的间隔的问题，但对于不知道何时你的代码才被真正执行，也是由这个方案来解决的。*/ 
(function() {
    var lastTime = 0;
    var vendors = ['webkit', 'moz'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] ||    // name has changed in Webkit
                                      window[vendors[x] + 'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
            }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
//扩展window
(function(w){
	/*扩展canvasContext2D*/
	w.CanvasRenderingContext2D.prototype.roundRect = function (x, y, w, h, r) {
        //if (w < 2 * r) r = w / 2;
        //if (h < 2 * r) r = h / 2;
        this.beginPath();
        this.moveTo(x+r, y);
        this.arcTo(x+w, y, x+w, y+h, r);
        this.arcTo(x+w, y+h, x, y+h, r);
        this.arcTo(x, y+h, x, y, r);
        this.arcTo(x, y, x+w, y, r);
        // this.arcTo(x+r, y);
        this.closePath();
        return this;
    };
})(window);

/*扩展NodeList*/
(function(dom){
	
})(NodeList.prototype);

/*扩展Zepto*/
(function($){
	
})(window.Zepto ? window.Zepto : {});

/*扩展jQuery*/
(function($){
	//封装基于jQuery的同时兼容单击、长按、移动事件
	$.fn.tclick = function(starthandler, endhandler, movehandler, llclickhandler){
		var _self = this;
		_self.on("touchstart", function(e){
			e = e.originalEvent;
			var isMove = false;
			var touch = e.touches[0]; // touches数组对象获得屏幕上所有的touch，取第一个touch
			var startPos = { // 取第一个touch的坐标值
				x: touch.pageX,
				y: touch.pageY,
				time: new Date().getTime()
			};
			if(starthandler && typeof starthandler == "function"){
				starthandler(e);
			}
			var qrcodePress = setTimeout(function(){//按住1.5秒后触发事件
				if(llclickhandler && typeof llclickhandler == "function"){
					llclickhandler(e);
				}
			}, 1500);
			
			function touchMove(e1){
				e1 = e1.originalEvent;
				if (e1.touches.length > 1 || e1.scale && e1.scale !== 1) return;
				var touch1 = e1.touches[0];
				var endPos = {
					x: touch1.pageX - startPos.x,
					y: touch1.pageY - startPos.y
				};
				var distance = Math.sqrt(Math.pow(endPos.x, 2) + Math.pow(endPos.y, 2));
				if(distance > 10){
					isMove = true;
					clearTimeout(qrcodePress);//滑动后取消按住触发事件
				}
				if(isMove){//滑动结束动作
					if(movehandler && typeof movehandler == "function"){
						movehandler(e1);
					}
				}
			}
			function touchEnd(e2){
				e2 = e2.originalEvent;
				var duration = new Date().getTime() - startPos.time;    // 按住的持续时间
				if(qrcodePress){
					clearTimeout(qrcodePress);//滑动后取消按住触发事件
				}
				if (duration <= 600 && !isMove) {//点击生效动作
					if(endhandler && typeof endhandler == "function"){
						clearTimeout(qrcodePress);//滑动后取消按住触发事件
						endhandler(e2);
					}
				}
			}
			_self.off("touchmove", touchMove);
			_self.off("touchend", touchEnd);
			_self.on("touchmove", touchMove);
			_self.on("touchend", touchEnd);
		});//touchstart---end
	};
})(window.jQuery ? window.jQuery : {});
var Util = {
	    infoUpdateId: null,
	    updateInfo: function(text, processing){
	    	var infoBar = document.getElementById('gps_processing'),
	            dots = '...',
	            i = 0,
	            that = this;
	        if (this.infoUpdateId !== null) {
	            clearTimeout(this.infoUpdateId);
	        };
	        if (processing) {
	        	if(processing == "error"){
	        		infoBar.innerHTML = text;
	        	}else{
	        		 infoBar.innerHTML = text + dots.substring(0, i++);
	        		//animate dots at the end of the info text
		            var animateDot = function() {
		                if (i > 3) {
		                    i = 0
		                };
		                infoBar.innerHTML = text + dots.substring(0, i++);
		                that.infoUpdateId = setTimeout(animateDot, 250);
		            }
		            this.infoUpdateId = setTimeout(animateDot, 250);
	        	}
	        	if(!infoBar.classList.contains("show")){
	            	infoBar.classList.add("show");
	            }
	        }else{
	        	if(infoBar.classList.contains("show")){
	        		infoBar.classList.remove("show");
	        	}
	        }
	    },
		each: function(elements, callback){//callback(value, index, arr);其中arr可能为'undefined' or 'array'
			if(isArray(elements)){
				elements.forEach(function(value, index, arr){ callback.call(value, value, index, arr) })
			}else{
				var i, key;
				if (likeArray(elements)) {
				  for (i = 0; i < elements.length; i++)
					if (callback.call(elements[i], elements[i], i) === false) return elements
				} else {
				  for (key in elements)
					if (callback.call(elements[key], elements[key], key) === false) return elements
				}
			}
			return elements
        },
		ajax: function(url,fn,posto){
			var xhr = new XMLHttpRequest();  
			if (url.length==0){ 
			  return;
			}
			xhr.onload = function(){ 
				var r = null;
				if (xhr.readyState==4 && xhr.status==200 ){
					var r=xhr.responseText;	
					if(r && typeof r =='string'){
						r=eval('('+r+')');
					}
				}
				if(fn && typeof fn == "function"){
					fn(r);  
				}
			};  
			if(posto){
				var postStr='';
				for(var key in posto){
					postStr+=key+'='+posto[key]+'&';
				}
				postStr=postStr.slice(0,postStr.length-1);
				xhr.open("POST",url,true);
				xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
				xhr.send(postStr);
			}else{
				xhr.open("GET",url,true);
				xhr.send(); 
			}
			return xhr;
		}, //--ajax--end
		loadImage: function(path, callback) {
		    var img = new Image();
		    img.src = path;
		    img.onload = function() {
		        img.onload = null;
		        callback(path);
		    };
		},
		loadScript: function(list, callback){
		    var loaded = 0;
		    var loadNext = function () {
		        Util.loadSingleScript(list[loaded], function(){
		            loaded++;
		            if (loaded >= list.length) {
		                callback();
		            }
		            else {
		                loadNext();
		            }
		        })
		    };
		    loadNext();
		},
		loadSingleScript: function(src, callback){
		    var s = document.createElement('script');
		    if (s.hasOwnProperty("async")) {
		        s.async = false;
		    }
		    s.type = "text/javascript";
		    if(s.readyState){
		    	s.onreadystatechange = function(){
		    		if(s.readyState == "loaded" || s.readyState == "complete"){
		    			s.onreadystatechange = null;
		    			callback();
		    		}
		    	};
		    }else{
		    	s.addEventListener('load', function () {
			        this.removeEventListener('load', arguments.callee, false);
			        callback();
			    }, false);
		    }
		    s.src = src;
		    document.body.appendChild(s);
		},
		ajaxLoadScript: function(url){
			var xhr = new XMLHttpRequest();
			xhr.open("GET", url, true);
			xhr.onreadystatechange = function(){
				if(xhr.readyState == 4){
					if(xhr.status >= 200 && xhr.status < 300 || xhr.statuc == 304){
						var s = document.createElement("script");
						s.type = "text/javascript";
						s.text = xhr.responseText;
						document.body.appendChild(s);
					}
				}
			};
			xhr.send(null);
		},
		/*******三种克隆js对象的方式******/
		clone1: function(obj){
			var o;  
		    switch(typeof obj){  
		    case 'undefined': break;  
		    case 'string'   : o = obj + '';break;  
		    case 'number'   : o = obj - 0;break;  
		    case 'boolean'  : o = obj;break;  
		    case 'object'   :  
		        if(obj === null){  
		            o = null;  
		        }else{  
		            if(obj instanceof Array){  
		                o = [];  
		                for(var i = 0, len = obj.length; i < len; i++){  
		                    o.push(clone(obj[i]));  
		                }  
		            }else{  
		                o = {};  
		                for(var k in obj){  
		                    o[k] = clone(obj[k]);  
		                }  
		            }  
		        }  
		        break;  
		    default:          
		        o = obj;break;  
		    }  
		    return o;     
		},
		clone2: function(obj){
			var o, obj;  
		    if (obj.constructor == Object){  
		        o = new obj.constructor();   
		    }else{  
		        o = new obj.constructor(obj.valueOf());   
		    }  
		    for(var key in obj){  
		        if ( o[key] != obj[key] ){   
		            if ( typeof(obj[key]) == 'object' ){   
		                o[key] = clone2(obj[key]);  
		            }else{  
		                o[key] = obj[key];  
		            }  
		        }  
		    }  
		    o.toString = obj.toString;  
		    o.valueOf = obj.valueOf;  
		    return o;  
		},
		clone3: function(obj){
			function Clone(){};
			Clone.prototype = obj;
			var o = new Clone();
			for(var key in o){
				if(typeof o[key] == "object"){
					o[key] = Clone3(o[key]);
				}
			}
			return o;
		},
		/*box.getBoundingClientRect().top // 元素上边距离页面上边的距离
		  box.getBoundingClientRect().right // 元素右边距离页面左边的距离
		  box.getBoundingClientRect().bottom // 元素下边距离页面上边的距离
		  box.getBoundingClientRect().left // 元素左边距离页面左边的距离
		  box.getBoundingClientRect().width // 元素自身的宽度, <特殊canvas>:此处是canvas.style.width,因为 canvas.width是实际画布的宽度，canvas.style.width是浏览器中渲染的宽度也就是元素自身的宽度，
		  box.getBoundingClientRect().height // 元素自身的高度, <特殊canvas>:此处是canvas.style.height,因为 canvas.height是实际画布的高度，canvas.style.height是浏览器中渲染的高度也就是元素自身的高度
		 */		
		getRectBoxObj: function(element){
			var box = element.getBoundingClientRect();
			var top = box.top;         // 元素上边距离页面上边的距离
			var right = box.right;       // 元素右边距离页面左边的距离
			var bottom = box.bottom;      // 元素下边距离页面上边的距离
			var left = box.left;        // 元素左边距离页面左边的距离
			var width = box.width || right - left;     //元素自身的宽度
			var height = box.height || bottom - top;     //元素自身的高度
			return {'top': top, 'left': left, 'right': right, 'bottom': bottom, 'width': width, 'height': height};
		},
		//返回指定范围的随机数：[lowerValue, upperValue]
		getRandom: function(lowerValue, upperValue){
			var choics = upperValue - lowerValue + 1;
			return (Math.random() * choics + lowerValue)|0;
		},
		uuid: function(){
			return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
		        var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
		        return v.toString(16);
		    });
		},
		//浮点度数（xxx.xxx）转换成度、分、秒形式
		decTODegree: function(dec){
			dec = +dec;
			var du = Math.floor(dec);
			var fen = Math.floor((dec - du)*60);
			var sec = Math.round(((dec - du)*60 - Math.floor((dec - du)*60))*60);
			return du + "°" + fen + "′" + sec + "″";
		},
		//度、分、秒转换成浮点读书（xxx.xxx）
		degreeToDec: function(degree){
			degree = degree + "";
			var du = parseFloat(degree+"");
			
			degree = degree.replace(du+"°", "");
			var fen = parseFloat(degree);
			
			degree = degree.replace(fen+"′", "");
			var sec = parseFloat(degree);
			return (sec/60.000 + fen)/60.000 + du;
		},
		setSessionStorage: function(key, value){
			try{
				if(window.sessionStorage){
					var storage = window.sessionStorage;
					storage.setItem(key, value);
				}
			}catch(e){
			}
		},
		getSessionStorage:function(key){
			try{
				if(window.sessionStorage){
					var storage = window.sessionStorage;
					if(storage.getItem(key)){
						return storage.getItem(key);
					}
					return null;
				}
			}catch(e){
				return null;
			}
		},
		removeSessionStorage: function(key){
			try{
				if(window.sessionStorage){
					var storage = window.sessionStorage;
					storage.removeItem(key);
				}
			}catch(e){
			}
		},
		clearSessionStorage: function(){
			try{
				if(window.sessionStorage){
					var storage = window.sessionStorage;
					storage.clear();
				}
			}catch(e){
			}
		},
		setLocalStorageItem: function(key, value){
			try{
				var storage = window.localStorage;
				if(storage){
					storage.setItem(key, value);
				}
			}catch(e){
			}
		},
		getLocalStorageItem: function(key){
			try{
				var storage = window.localStorage;
				if(storage){
					var value = null;
					if(storage.getItem(key)){
						value = storage.getItem(key);
					}
					return value;
				}
			}catch(e){
				return null;
			}
		},
		removeLocalStorageItem: function(key){
			try{
				var storage = window.localStorage;
				if(storage){
					storage.removeItem(key);
				}
			}catch(e){
			}
		},
		getAllLocalStorage: function(){//获取所有本地存储，并拼装成JSON对象返回
			try{
				var storage = window.localStorage;
				if(storage){
					var all = {};
					for(var i=0;i<storage.length;i++){
						var key = storage.key(i);
						all[key] = storage.getItem(key);
					}
					return all;
				}
			}catch(e){
				return null;
			}
		},
		clearAllLocalStorage: function(){
			try{
				var storage = window.localStorage;
				if(storage){
					storage.clear();
				}
			}catch(e){
				return null;
			}
		},
		/*options = {
		*	     enableHighAccuracy,//boolean 是否要求高精度的地理信息
		*	     timeout,//获取信息的超时限制
		*	     maximumAge//对地理信息进行缓存的时间
		*}
		*onsuccess方法中会返回position对象:
		*
		*lat: position.coords.latitude,//十进制纬度
		*lng: position.coords.longitude,//十进制经度
		*heading: position.coords.heading,//指南针方向，相对于正北方向顺时针方向计算,NaN or null表示没有检测到数据
		*accuracy: position.coords.accuracy,//经、纬坐标精度（米）
		*altitude: position.coords.altitude,//海拔高度（米），如果没有数据则值为null
		*altitudeAccuracy: position.coords.altitudeAccuracy,//海拔高度的精度（米），值越大越不精确
		*speed: position.coords.speed,//速度（米/秒），如果没有数据则值为null
		*timestamp: position.timestamp //地理数据创建的时间
	    */
		getCurrentPosition: function(onSuccess,onError,options){
			var geolocation = navigator.geolocation;
			if(geolocation){
				geolocation.getCurrentPosition(onSuccess,function(error){if(onError && isFunction(onError)) onError(error);},options);
			}else{
				if(onError && isFunction(onError)) onError({"code": 500, "message": "data null"});
			}
		},
		watchCurrentPosition: function(onSuccess,onError,options){
			var geolocation = navigator.geolocation;
			var watchId = null;
			if(geolocation){
				watchId = geolocation.watchPosition(onSuccess,function(error){if(onError && isFunction(onError)) onError(error);},options);
			}else{
				watchId = null;
				if(onError && isFunction(onError)) onError({"code": 500, "message": "data null"});
			}
			return watchId;
		},
		clearWatch: function(watchId){
			var geolocation = navigator.geolocation;
			if(geolocation && watchId != null){
				watchId = geolocation.clearWatch(watchId);
				watchId = null;
			}
		},
		getPosition: function(fn, error){//GPS定位获取用户当前位置经纬度坐标
			var geolocation = navigator.geolocation;
			if(geolocation){
				try{
					geolocation.getCurrentPosition(function(position){
						try{
							var latLng={
									lat: position.coords.latitude,//十进制纬度
									lon: position.coords.longitude,//十进制经度
							};
							var gpsObj = PositionUtil.gps84_To_Gcj02(latLng.lat, latLng.lon);
							if(gpsObj != null){
								latLng.lat = gpsObj.wgLat;
								latLng.lon = gpsObj.wgLon;
							}
							fn(latLng);
						}catch(e){
						}
					},function(err){
						if(error && isFunction(error)){
							error(err);
						}
					},{timeout:5000});
				}catch(e){
					if(error && isFunction(error)){
						error({"code": 500, "message": "data null"});
					}
				}
			}else{
				if(error && isFunction(error)){
					error({"code": 500, "message": "data null"});
				}
			}
		},
		gpsMoving: function(fn, error){
			var watchId = this.watchCurrentPosition(function(position){
				try{
					var latLng={
							lat: position.coords.latitude,//十进制纬度
							lon: position.coords.longitude,//十进制经度
					};
					var gpsObj = PositionUtil.gps84_To_Gcj02(latLng.lat, latLng.lon);
					if(gpsObj != null){
						latLng.lat = gpsObj.wgLat;
						latLng.lon = gpsObj.wgLon;
					}
					fn(latLng);
				}catch(e){
				}
			}, function(){
				if(error && typeof error == "function"){
					error();
				}
			});
			return watchId;
		},
		/**
		 * 给字符串模板填充数据：
		 * 格式化字符串：xxx {0} xxx {1} xxx
		 * @param {Object} str
		 * @param {Object} args 字符串变量，多个变量数组形式
		 */
		formatMsg: function(str, args){
			if(typeof args != "object"){
				eval("args=['"+ args + "']");
			}
			for(var i = 0; i < args.length; i++){
				var toReplace = "{" + i + "}";
				str = str.replace(toReplace, args[i]);
			}
			return str;
		},
		//快速对字符转义(让浏览器底层帮我们转义)，避免跨站攻击XSS
		stringEncode: function(str){
		       var div=document.createElement('div');
		       if(div.innerText){
		           div.innerText=str;
		       }else{
		           div.textContent=str;//Support firefox
		       }
		       return div.innerHTML;
		},
		isEmptyObject: function( obj ) {
			var name;
			for (name in obj ) {
				if(obj.hasOwnProperty(name)){
					return false;
				}
			}
			return true;
		},
		hasFlash: function(){
			if (navigator.plugins && navigator.plugins.length && navigator.plugins['Shockwave Flash']) {
			   return true;
			} else if (navigator.mimeTypes && navigator.mimeTypes.length) {
			   var mimeType = navigator.mimeTypes['application/x-shockwave-flash'];
			   return mimeType && mimeType.enabledPlugin;
			} else {
			   try {
			     var ax = new ActiveXObject('ShockwaveFlash.ShockwaveFlash');
			     return true;
			   } catch (e) {}
			}
			return false;
		},
		getFlashVersion: function(){
			var version = -1;
		    if( window.ActiveXObject ) {
		        try{
		            var swf = new ActiveXObject("ShockwaveFlash.ShockwaveFlash");
		            version = parseInt( swf.GetVariable("$version").split(" ")[1].split(",")[0]);
		        }
		        catch(e){}
		    }else{
		        if( navigator.plugins && navigator.plugins["Shockwave Flash"] ) {
		            var arr = navigator.plugins['Shockwave Flash'].description.split(' ');
		            var i = 0;
		            var length = arr.length;
		            if ( arr ) {
		                for ( ; i < length ; i++) {
		                    if (!isNaN( Number(arr[i]) )) {
		                        version = Number(arr[i]);
		                        break;
		                    }
		                }
		            }
		        }
		    }
		    return version;
		},
		//获取屏幕的DPI=[x, y]
		getDPI: function() {
			var arrDPI = new Array;
			if (window.screen.deviceXDPI) {
				arrDPI[0] = window.screen.deviceXDPI;
				arrDPI[1] = window.screen.deviceYDPI;
			}
			else {
				var tmpNode = document.createElement("DIV");
				tmpNode.style.cssText = "width:1in;height:1in;position:absolute;left:0px;top:0px;z-index:99;visibility:hidden";
				document.body.appendChild(tmpNode);
				arrDPI[0] = parseInt(tmpNode.offsetWidth);
				arrDPI[1] = parseInt(tmpNode.offsetHeight);
				tmpNode.parentNode.removeChild(tmpNode); 
			}
			return arrDPI;
		},
		getLevel: function(len, lat, zoom){
			return len / 2 * (1/((Math.cos(+lat * Math.PI / 180) * 2 * Math.PI * 6378137) / (256 * Math.pow(2, zoom))));
		},
		getTimeStamp: function(){
			return +new Date();
		},
		//从时间戳转化成yyyy-MM-dd HH:mm:ss
		getDate: function(tm){
			var tt=new Date(parseInt(tm) * 1000).toLocaleString().replace(/\//g, "-")
			return tt.toString();
		},
		/*将url参数、hash转换成js对象*/
		parseQueryUrl: function( url ){//为了防止误会：url所带参数中不要有：# , 因为location.hash是以#开始的。而且url中参数（？）和 hash（#）是有顺序的：先是 ？，后是 #
		    var reg_url =/^[^\?]+\?([\w\W]+)$/,
		        reg_para=/([^&=]+)=([\w\W]*?)(&|$)/g, //g is very important
		        _re = /\%[0-9A-Z]{2}/, //解析encodeURIComponent对中文的编码文本
		        arr_url = reg_url.exec( url ),
		        ret = {};
		    if(arr_url && arr_url.length > 0 && arr_url[1].indexOf("#") != -1){
		    	ret['hash'] = arr_url[1].substr(arr_url[1].indexOf("#")+1);
		    	arr_url[1] = arr_url[1].substring(0, arr_url[1].indexOf("#"));
		    }
		    if( arr_url && arr_url[1] ){
		        var str_para = arr_url[1],result;
		        while((result = reg_para.exec(str_para)) != null){
		        	var _res = result[2];
		        	if(_re.test(_res)){
		        		ret[result[1]]  = decodeURIComponent(_res);
		        	}else{
		        		ret[result[1]] = _res;
		        	}
		        }
		    }
		    return ret;
		},
		preventDefault: function(event){
			if(event.preventDefault){
				event.preventDefault();
			}else{
				event.returnValue = false;
			}
		},
		stopPropagation: function(event){
			if(event.stopPropagation){
				event.stopPropagation();
			}else{
				event.cancelBubble = true;
			}
		}
};
