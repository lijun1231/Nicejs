/**
 * Created by Administrator on 2016/8/18.
 */
Vue.component('usr',{
    // 声明 props
    props: ['msg','myMsg'],
    data:function(){
        return {
            m:this.msg,
            mmsg:this.myMsg
        }
    },
    // prop 可以用在模板内
    template: '<span>pos:{{ m }}</span><br/><h2>msg:{{myMsg||"222"}}</h2>'
});
Vue.component('coment-list',{
    // 声明 props
    props: ['vid','cmt'],
    data:function(){
        var me=this;
        return {}
    },
    methods: {
        changeCmt: function () {
            //this.$dispatch('coment-list', this.cmt);
        }
    },
    activate: function (done) {
        done();
    },
    //template: '<li v-for="c in cmt" data-id="{{c.uid}}">{{}}</li>'
    template:'<li v-for="c in cmt" data-id="{{c.uid}}"><div class="itm auto"><span class="itm-tit"><img :src="c.portrait" class="detail-comment-pic eq-wh radius"/></span><span class="itm-sub"><h3 class="detail-comment-t disp-b">{{c.nickname}} {{c.create_time|date}}</h3><span class="detail-comment-p disp-b">{{c.content}}</span></span></div></li>'
});
Vue.component('video-box',{
    // 声明 props
    props: ['vsrc'],
    data:function(){
        console.log(this.vsrc);
        return {}
    },
    activate: function (done) {
        done();
    },
    template:'<div class="video-box">{{vsrc.v}}<script v-bind:src="vsrc.v"></script></div>'
});