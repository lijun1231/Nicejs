//创建时间：2016年8月15日 09:13:57
//创建人：李君
//说明：首页
var VM={};
!function(){
    var me=j_m.currPage;
    me.hook(function() {
        var $page=$(j_m.currPage[0]);
        var vm2 = me.vm;
        if (!vm2) {
            vm2 = me.vm = new Vue({
                el: $page[0],
                data: {
                    video_id: j_m.cateHash.video_id,
                    video_title: '',
                    video_desc: '',
                    username: '',
                    mobile: '',
                    authcode: '',
                    shoot_location: '',
                    shoot_city: '',
                    shoot_time: '',
                    tag_ids: '',
                    v: {},
                    atags: [],
                    userinfo: {}
                },
                ready:function(){
                    Junb.addClass(me[0],'ready');
                    j_m.compilePage();
                    setTimeout(function(){
                        vm2.sendPhoneCode();
                        j_m.compilePage();
                    },100);
                },
                set: function (itm) {
                },
                methods: {
                    fnSub: function (a) {
                        var me = this;
                        var $data = this.$data;
                        if(me.formateForm()){
                            //提交认证
                            setUserinfo(function(data){
                                if(data.mobile_no){//如果有手机号，则直接修改视频
                                    me.modifyVideo();//修改视频
                                }else{//如果没有手机号，则先提交认证再提交视频
                                    Util.callService({
                                        url: oUserinfo.addr.interface + "/index.php?d=account&c=account&m=bindMobile",
                                        paras: {
                                            mobile: $data.mobile,
                                            authcode: $data.authcode,
                                            username: $data.username
                                        },
                                        callback: function (data) {
                                            if(+data.errcode===0){
                                                me.modifyVideo();//修改视频
                                                setUserinfo(null,true);
                                            }else if(+data.errcode==4005){
                                                Util.Alert('验证码错误');
                                            }else if(+data.errcode==4015){
                                                Util.Alert('该手机号码已经被绑定');
                                            }
                                        }
                                    });
                                }
                            });
                        }
                    },
                    formateForm:function(){
                        if(!isFormatedForNull()){
                            return false;
                        }
                        if(!oUserinfo.info.mobile_no){
                            if(!Util.checkMobile(vm2.mobile)){
                                Util.Alert("请输入正确的手机号码");
                                return false;
                            }
                            if(!Util.checkLimitCode(vm2.authcode,'num',6,6)){
                                Util.Alert("请输入正确的验证码");
                                return false;
                            }
                        }
                        return true;
                    },
                    modifyVideo:function (){
                        var $data = this.$data;
                        Util.callService({
                            url: oUserinfo.addr.interface + "/index.php?d=account&c=video&m=modifyVideoDetail",
                            paras: {
                                video_id: j_m.cateHash.video_id,
                                video_title: $data.video_title,
                                video_desc: $data.video_desc,
                                shoot_location: $data.shoot_location,
                                shoot_city: $data.shoot_city,
                                shoot_time: $data.shoot_time,
                                tag_ids: $data.tag_ids
                            },
                            callback: function (data) {
                                if(+data.errcode===0){
                                    j_m.changeHash('success');
                                }else{
                                    Util.Alert('操作失败，请认真检查后再提交');
                                }
                            }
                        });
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
                                        mobile:vm2.mobile,
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
                            vm2.tag_ids = (function () {
                                var str = '';
                                var atags = vm2.atags;
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
            vm2.sendPhoneCode();//验证码
        }
        setUserinfo(function(data){
            vm2.userinfo=data;
            vm2.$set("userinfo",data);
            vm2.$set("userinfo.mobile_no",data.mobile_no);
        });
        //请求视频信息
        Util.callService({
            url: oUserinfo.addr.interface + "/index.php?d=account&c=video&m=getVideoDetail",
            paras: {
                video_id: j_m.cateHash.video_id
            },
            callback: function (data) {
                if(data.data.owner==0){
                    Util.Alert("您不具有修改该视频的权限");
                    j_m.changeHash('main');
                    return;
                }
                vm2.v=data.data;
                vm2.shoot_time=vm2.v.create_time;
                vm2.shoot_city=vm2.v.shoot_city;
                var tags=vm2.v.tags;//当前标签
                //视频
                !function(){
                    var vm=vm2;
                    //视频
                    //vm.sewise_src="sewise-player/sewise-player/player/sewise.player.min.js?server=vod&type=mp4&videourl="+vm.v.video_url+"&media_id=AR25sJ0Z2qjD7sTNkISV0klbGFSqBJqNZT7B14DeeQdc_rw2WidHpVUyUNDEhzn0&sourceid=02&autostart=false&starttime=0&lang=en_US&title=VodVideo&buffer=5&claritybutton=disable&skin=vodFlowPlayer&fallbackurls=%7B%0A%09%22ogg%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.ogg%22%2C%0A%09%22webm%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.webm%22%0A%7D&topbardisplay=disable&poster="+vm.v.video_cover+"";
                    //$page.find('.video-box').html("<script src='"+vm.sewise_src+"'><\/script>");
                    //j_m.compilePage();
                }();
                //请求标签
                Util.callService({
                    url: oUserinfo.addr.interface + "/index.php?d=account&c=video&m=getTags",
                    paras: {
                        video_id: j_m.cateHash.video_id
                    },
                    callback: function (data) {
                        var atags=vm2.atags=data.data;//所有标签
                        for(var n=0;n<atags.length;n++){
                            vm2.$set('atags['+n+']',atags[n]);
                            vm2.$set('atags['+n+'].c',atags[n]['c']);
                        }
                        //设置标签状态
                        if(tags&&tags.length!==0){
                            for(var i=0;i<tags.length;i++){
                                var tagId=tags[i].tag_id;
                                vm2.getItmById('tag_id',atags,tagId,function(dd){
                                    dd.c=true;
                                    vm2.tag_ids+=tagId+',';
                                });
                            }
                            if(/\,$/.test(vm2.tag_ids)){vm2.tag_ids=vm2.tag_ids.substr(0,vm2.tag_ids.length-1);}
                        }
                    }
                });
            }
        });
    });
}();