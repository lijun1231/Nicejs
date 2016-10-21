//创建时间：2016年8月15日 09:13:57
//创建人：李君
//说明：首页
!function(){
    var $page=$(j_m.currPage[0]);
    var me=j_m.currPage;
    me.hook(function(){
        var vm=me.vm;
        if(!vm){
            vm=me.vm=new Vue({
                el:$page[0],
                data:{
                    v:{},
                    video_id:j_m.cateHash.video_id,
                    comment:'',
                    cmt:{}
                },
                created:function(){
                    console.log("11111111111111111111");
                },
                beforeCompile:function(){
                    console.log("2222222222222222222222222222");
                },
                compiled:function(){
                    console.log("333333333333333333333");
                },
                update:function(){
                    console.log("44444444444444444444");
                },
                ready:function(){
                    Junb.addClass(me[0],'ready');
                    j_m.compilePage();
                    setTimeout(function(){
                        j_m.compilePage();
                    },100);
                },
                methods:{
                    del:function(e){
                        Util.SelectAlert([{
                            id:true,
                            value: "确认删除"
                        },{
                            id:false,
                            value: "不删除了"
                        }],function(data){
                            if(data.id){
                                //删除视频
                                Util.callService({
                                    url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=delMyVideo",
                                    paras:{
                                        video_id:j_m.cateHash.video_id
                                    },
                                    callback:function(data){
                                        if(+data.errcode===0){
                                            Util.Alert('删除成功');
                                            j_m.changeHash('main');
                                        }else{
                                            Util.Alert('删除失败');
                                        }
                                    }
                                });
                            }
                        });
                    },
                    fnComment:function(e){
                        var me=this;
                        if(!me.comment){
                            Util.Alert("评论内容不能为空");
                            return;
                        }
                        Util.callService({
                            url: oUserinfo.addr.interface + "/index.php?d=account&c=video&m=comment",
                            paras: {
                                video_id: j_m.cateHash.video_id,
                                content:me.comment
                            },
                            callback: function (data) {
                                if(data.errcode==0){
                                    Util.Alert("评论成功");
                                    me.comment='';
                                    me.v.comments=+me.v.comments+1;
                                    loadCommentList();
                                }
                            }
                        });
                    },
                    condTip:function(e,type){
                        if(type==='like'){
                            Util.callService({
                                url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=like",
                                paras:{
                                    video_id:j_m.cateHash.video_id,
                                    act:vm.v.liked?2:1
                                },
                                callback:function(data){
                                    vm.v.likes = vm.v.liked?vm.v.likes-1:vm.v.likes+1;
                                    vm.v.liked= !vm.v.liked;
                                }
                            });
                        }
                    }
                }
            });
        }else{
            vm.video_id=j_m.cateHash.video_id;
        }
        //获取详情
        Util.callService({
            url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=getVideoDetail&stamp="+new Date().getTime(),
            paras:{
                video_id:j_m.cateHash.video_id
            },
            callback:function(data){
                if(data.errcode===2000){
                    Util.Alert('无此视频');
                    j_m.changeHash('main');
                    return;
                }
                vm.v=data.data;
                vm.$set('v.likes',+vm.v.likes);
                vm.$set('v.liked',vm.v.liked==1);
                //视频
                vm.sewise_src="../pub/sewise-player/sewise-player/player/sewise.player.min.js?server=vod&type=mp4&videourl="+vm.v.video_url+"&media_id=AR25sJ0Z2qjD7sTNkISV0klbGFSqBJqNZT7B14DeeQdc_rw2WidHpVUyUNDEhzn0&sourceid=&autostart=false&starttime=0&lang=en_US&title=VodVideo&buffer=5&claritybutton=disable&skin=vodFlowPlayer&fallbackurls=%7B%0A%09%22ogg%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.ogg%22%2C%0A%09%22webm%22%3A%20%22http%3A%2F%2Fjackzhang1204.github.io%2Fmaterials%2Fmov_bbb.webm%22%0A%7D&topbardisplay=disable&poster="+vm.v.video_cover+"";
                $page.find('.video-box').html("<script src='"+vm.sewise_src+"'><\/script>");
                j_m.compilePage();
            }
        });
        //评论列表
        var loadCommentList=function(){
            Util.callService({
                url: oUserinfo.addr.interface + "/index.php?d=account&c=video&m=getCommentList",
                paras: {
                    video_id: vm.video_id
                },
                callback: function (data) {
                    vm.cmt=data.data.reverse();
                    setTimeout(function(){
                        j_m.compilePage();
                    });
                }
            });
        };
        loadCommentList();
        //阅读量
        Util.callService({
            url:oUserinfo.addr.interface+"/index.php?d=account&c=video&m=view",
            paras:{
                video_id:vm.video_id
            },
            callback:function(data){
            }
        });
    });
}();