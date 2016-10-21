/**
 * Created by Administrator on 2016/9/8.
 */
Vue.directive('demo',{
    deep:true,
    twoWay:true,
    bind:function(){
        // 准备工作
        // 例如，添加事件处理器或只需要运行一次的高耗任务
        this.handler=function(){
            this.set(this.el.value);
        }.bind(this);
        this.el.addEventListener('input',this.handler);
    },
    update:function(value,oldValue){
        // 值更新时的工作
        // 也会以初始值为参数调用一次
        this.el.innerHTML =
            'name - '       + this.name + '<br>' +
            'expression - ' + this.expression + '<br>' +
            'arg - '   + this.arg + '<br>' +
            'modifiers - '  + JSON.stringify(this.modifiers) + '<br>' +
            'value - '      + JSON.stringify(value)
        console.log(value);
    },
    unbind:function(){
        // 清理工作
        // 例如，删除 bind() 添加的事件监听器
        this.el.removeEventListener('input',this.handler);
    }
});
Vue.directive('demo-inp',{
    deep:true,
    twoWay:true,
    bind:function(){
        // 准备工作
        // 例如，添加事件处理器或只需要运行一次的高耗任务
        this.handler=function(){
            this.set(this.el.value);
        }.bind(this);
        this.el.addEventListener('input',this.handler);
    },
    update:function(value,oldValue){
        // 值更新时的工作
        // 也会以初始值为参数调用一次
        console.log('oldValue'+oldValue);
        console.log('value'+value);
    },
    unbind:function(){
        // 清理工作
        // 例如，删除 bind() 添加的事件监听器
        this.el.removeEventListener('input',this.handler);
    }
});
Vue.directive('style',function(val){
    console.log(val);
});
Vue.directive('example', {
    params: ['start', 'end'],
    deep:true,
    bind: function (val) {
        this.txt=this.el.innerHTML;
        this.el.addEventListener('click',this.extendClick.bind(this),false);
    },
    extendClick:function(){
        Junb.toggleClass(this.el,'on');
    },
    paramWatchers:{
        start:function(val,oldVal){
            console.log('start changed');
            console.log(this.params);
            this.update();
        }
    },
    update:function(val,oldVal){
        console.log('updated');
        this.el.closest('.itm').style.display='block';
        this.el.innerHTML=this.params.start+this.txt+this.params.end;
    },
    unbind:function(){
        console.log('unbind');
        this.el.removeEventListener('click',this.extendClick);
    }
});
Vue.directive('example-cond',{
    bind:function(val){
        console.log(this.expression);
        if(this.expression==='close'){
            console.log(111);
            this.el.addEventListener('click',function(){
                this.el.closest('.itm').style.display='none';
            }.bind(this),false);
        }
    }
});
Vue.directive('cover-pic',{
    update:function(val){
        this.el.style.background='url('+val+') no-repeat center center';
        this.el.style.backgroundSize='cover';
        console.log(this.expression);
        if(this.expression==='close'){
            console.log(111);
            this.el.addEventListener('click',function(){
                this.el.closest('.itm').style.display='none';
            }.bind(this),false);
        }
    }
});
Vue.directive('form-format',{
    bind:function(){
        var reg;
        this.formatHandler=function(){
            var val=this.el.value.trim();
            var bool=false;
            switch(this.expression){
                case 'email':
                    var reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;
                    if(!reg.test(val)){
                        Util.Alert('请输入正确的邮箱');
                    }
                    break;
                case 'phone':
                    bool=(function(){
                        if ((/^(\d{3,4}\-)?\d{7,8}$/i.test(sPhone))) { //座机格式010-98909899
                            return true;
                        } else if ((/^0(([1-9]\d)|([3-9]\d{2}))\d{8}$/.test(sPhone))) { //座机格式01098909899
                            return true;
                        } else if ((/^(400)\d{7}$/.test(sPhone))) { //座机格式4000000000
                            return true;
                        } else {
                            return false;
                        }
                    })();
                    if(!bool){
                        Util.Alert('请输入正确的电话号码');
                    }
                    break;
                case 'mobile':
                    bool=(function(){
                        if (!(/^1[3|4|5|8|7][0-9]\d{8}$/.test(val))) {
                            return false;
                        } else {
                            return true;
                        }
                    })();
                    if(!bool){
                        Util.Alert('请输入正确的手机号码');
                    }
                    break;
            }
        }.bind(this);
        this.el.addEventListener('blur',this.formatHandler);
    }
});







