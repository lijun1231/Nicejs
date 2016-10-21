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
                    user_name:'',
                    name_able:true,
                    user_email:'',
                    mobile:'',
                    user_units:'',
                    user_duty:'',
                    user_application:''
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
                    fnSub: function () {
                        var me = this;
                        var $data = this.$data;
                        if(me.formateForm()){
                            //提交认证
                            console.log($data);
                            $.ajax({
                                url: "http://www.sooneus.tv/wechat_web/index.php?d=base&c=admin_Register&m=ajax_saveUserInfo",
                                type:'post',
                                data: {
                                    user_name: vm.user_name,
                                    user_email: vm.user_email,
                                    mobile: vm.mobile,
                                    user_units: vm.user_units,
                                    user_duty: vm.user_duty,
                                    user_application: vm.user_application,
                                    secret:oUserinfo.secret
                                },
                                dataType:'json',
                                success: function (data) {
                                    if(+data.errcode===0){
                                        Util.Alert('提交成功，我们将尽快审核，请您耐心等待...');
                                    }else if(+data.errcode){
                                        Util.Alert('操作超时或其他管理员已操作');
                                    }
                                }
                            });
                        }
                    },
                    formateForm:function(){
                        if(!isFormatedForNull()){
                            return false;
                        }
                        if(!Util.checkMobile(vm.mobile)){
                            Util.Alert("请输入正确的手机号码");
                            return false;
                        }
                        if(!Util.isEmail(vm.user_email)){
                            Util.Alert("请输入正确的邮箱");
                            return false;
                        }
                        return true;
                    },
                    sendPhoneCode:function(){
                        var $upCodeBt=$page.find("#edit-upload-codebt");
                        var $upPhone=$page.find("#edit-upload-phone");
                        //发送验证码
                        $.VerifiCode({
                            bt: $upCodeBt,
                            num: $upPhone,
                            delay: 30,
                            check: function () {
                                if (!$upCodeBt.hasClass("on")) {
                                    return false;
                                }
                            },
                            callback:function(){
                                Util.callService({
                                    url: oUserinfo.addr.interface + "/index.php?d=account&c=account&m=sendAuthcode",
                                    paras: {
                                        mobile:vm.mobile,
                                        sms_type:'1'
                                    },
                                    callback: function (data) {
                                    }
                                })
                            },
                            fnWrong:function(){
                                Util.Alert("手机号格式错误");
                            }
                        });
                    },
                    toggleTag: function (id, e) {
                        this.getItmById('tag_id', this.atags, id, function (dd) {
                            dd.c = !dd.c;
                            vm.tag_ids = (function () {
                                var str = '';
                                var atags = vm.atags;
                                for (var i = 0; i < atags.length; i++) {
                                    if (atags[i].c) {
                                        str += atags[i].tag_id;
                                    }
                                }
                                return str.split('').join(",");
                            })();
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
        }else{
            vm.sendPhoneCode();//验证码
        }
    });
}();