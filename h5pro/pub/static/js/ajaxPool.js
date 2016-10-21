/*
 * ajax请求池
 * @author: linxl
 * */
var XMLHttp = {
    //定义第一个属性,该属性用于缓存XMLHttpRequest对象数组
    XMLHttpRequestPool:[],
    //对象的第一个方法,该方法用于返回一个XMLHttpRequest对象
    getInstance:function(){
        var len = this.XMLHttpRequestPool.length;
        //从XMLHttpRequestPool缓冲池中取出一个空闲的XMLHttpRequest对象
        for(var i=0;i<len;i++){
            //如果XMLHttpRequest的readyState的状态为0或者为4,都表示当前的对象
            //XMLHttpRequest对象为闲置的对象
            if(this.XMLHttpRequestPool[i].readyState==0 ||
                this.XMLHttpRequestPool[i]==4){
                return this.XMLHttpRequestPool[i];
            }
        }
        //如果没有空闲对象,将再次创建一个XMLHttpRequest对象
        this.XMLHttpRequestPool[this.XMLHttpRequestPool.length]=
        this.createXMLHttpRequest();
        return this.XMLHttpRequestPool[this.XMLHttpRequestPool.length-1];
    },
    //创建新的XMLHttpRequest对象
    createXMLHttpRequest:function(){
        var xmlHttpRequest = false;
        //Mozilla,fireFox,Operal浏览器
        if(window.XMLHttpRequest){
            //针对FireFox, Mozillar, Opera, Safari, IE7, IE8
            xmlHttpRequest = new XMLHttpRequest();
 
            //针对某些特定版本的mozillar浏览器的BUG进行修正
            if(xmlHttpRequest.overrideMimeType){
                xmlHttpRequest.overrideMimeType("text/xml");
            }
        }else if(window.ActiveXObject){
            //针对IE6, IE5, IE5.5
            //两个可以用于创建XMLHttpRequest对象的控件名称，保存在js的数组中
            //排在前面的版本较新
            var activexName = ["MSXML2.XMLHTTP","Microsoft.XMLHTTP"];
            for(var i = 0; i < activexName.length; i++){
                try {
                    //取出一个控件名进行创建，如果创建成功就终止循环
                    //如果创建失败，会抛出异常，捕捉异常后，可以继续循环，继续尝试创建
                    xmlHttpRequest = new ActiveXObject(activexName[i]);
                    break;
                } catch(e) {
                    xmlHttpRequest = false;                    
                }
            }
            //Mozilla某些版本没有readyState属性
            if(xmlHttpRequest.readyState==null){
                //直接设置readyState为0
                xmlHttpRequest.readyState = 0;
                //没有readyState属性的浏览器,将load动作与下面的函数关联起来
                xmlHttpRequest.addEventListener("load",function(){
                    if(typeof(xmlHttpRequest.onreadystatechange =="function")){
                        xmlHttpRequest.onreadystatechange();
                    }
                },false);
            }
        }
        if (!xmlHttpRequest || typeof XMLHttpRequest == 'undefined') {
            Alert("你的浏览器不支持xmlHttpRequest对象！");
            return;
        }
        return xmlHttpRequest;
    },
    //定义对象的第三个方法,发送请求,参数说明
    //method 为发送请求的方法(POST,GET),地址,数据,回调函数
    sendRequest:function(method,url,data,async,callback,error){
        var xmlHttpRequest = this.getInstance();
        if(xmlHttpRequest){
            try{
                //加随机数防止缓存,主要目的是防止直接从浏览器读取数据
               /* if(url.indexOf("?")>0){
                    url+="&time="+new Date().value();
                }else{
                    url+="?time="+new Date().value();
                }*/
                //打开与服务器的连接
                xmlHttpRequest.open(method,url,async);
                //设置状态改变的回调函数
                xmlHttpRequest.onreadystatechange = function(){
                    //当服务器的响应完成并获得正常的服务器响应时
                    if(xmlHttpRequest.readyState==4){
                    	var _status = xmlHttpRequest.status;
                        if(_status==200){
                        	var r = xmlHttpRequest.responseText;
                        	if(r && typeof r =='string'){
        						try{
        							r=eval('('+r+')');
        						}catch(e){}
        					}
                        	callback(r);
                        }
                        if(_status >= 400 || _status>= 500){
                        	if(error && typeof error == "function"){
                        		error();
                        	}
                        }
                    }
                }
                //如果采用POST请求
                if(method=="POST"){
                    //设置请求的头
                    xmlHttpRequest.setRequestHeader("Content-Type",
                        "application/x-www-form-urlencoded");
                    xmlHttpRequest.send(data);
                }
                //如果采用GET请求
                if(method=="GET"){
                    xmlHttpRequest.send(null);
                }

            }catch(e){
            }
        }
    }
};
