//创建时间：2016年8月15日 09:13:57
//创建人：李君
//说明：首页
var VM={};
!function(){
    var me=j_m.currPage;
    me.hook(function() {
        var $page=$(j_m.currPage[0]);
        var vm = me.vm;
        if (!vm) {
            vm = me.vm = new Vue({
                el: $page[0],
                data: {
                    v:{
                        user_name:'',
                        name_able:true,
                        user_email:'',
                        mobile:'',
                        user_units:'',
                        user_duty:'',
                        user_application:'',
                        role_list:[],
                        role_list_sel:''
                    }
                },
                ready:function(){
                    Junb.addClass(me[0],'ready');
                    $('#j-body').show();
                    j_m.compilePage();
                    setTimeout(function(){
                        j_m.compilePage();
                    },100);
                },
                set: function (itm) {
                },
                methods: {
                    toggleTag: function (id, e) {
                        var arr=this.v.role_list;
                        var cArr=[];
                        this.getItmById('id', arr, id, function (dd) {
                            dd.c=!dd.c;
                        });
                        for (var i = 0; i < arr.length; i++) {
                            console.log(arr[i].c);
                            if(arr[i].c){
                                cArr.push(arr[i].id);
                            }
                        }
                        this.v.role_list_sel=cArr.toString();
                    },
                    fnSub:function(e){
                        console.log(vm.v.role_list_sel);
                        $.ajax({
                            url: "http://www.sooneus.tv/wechat_web/index.php?d=base&c=admin_Register&m=ajax_saveRegUserInfo",
                            type:'post',
                            data: {
                                user_name: vm.v.user_name,
                                user_email: vm.v.user_email,
                                mobile: vm.v.mobile,
                                user_units: vm.v.user_units,
                                user_duty: vm.v.user_duty,
                                role_list: vm.v.role_list_sel,
                                secret:oUserinfo.secret
                            },
                            dataType:'json',
                            success: function (data) {
                                if(+data.errcode===0){
                                    Util.Alert('您已审核完毕');
                                }else if(+data.errcode){
                                    Util.Alert('操作超时或其他管理员已操作');
                                }
                            }
                        });
                    },
                    getItmById: function (itm, arr, id, fn) {
                        for (var j = 0; j < arr.length; j++) {
                            if (id == arr[j][itm]) {
                                fn && fn(arr[j]);
                                return true;
                            }
                        }
                        return false;
                    }
                }
            });
            $.ajax({
                url: "http://www.sooneus.tv/wechat_web/index.php?d=base&c=admin_Register&m=ajax_getRegUserInfo",
                type:'post',
                data: {
                    secret:oUserinfo.secret
                },
                dataType:'json',
                success: function (data) {
                    if(+data.errcode===0){
                        vm.v.user_name=data.data.user_name;
                        vm.v.user_email=data.data.user_email;
                        vm.v.mobile=data.data.mobile;
                        vm.v.user_units=data.data.user_units;
                        vm.v.user_duty=data.data.user_duty;
                        vm.v.user_application=data.data.user_application;
                        vm.v.role_list=data.data.role_list;
                        var arr=vm.v.role_list;
                        for (var j = 0; j < arr.length; j++) {
                            vm.$set('v.role_list['+j+']["c"]',false);
                        }
                    }else if(+data.errcode){
                        Util.Alert('身份非法');
                    }
                }
            });
        }else{
            vm.sendPhoneCode();//验证码
        }
    });
}();