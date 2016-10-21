/*************************************
 * Created by Great Fan on 2016/3/25.
 *************************************/

var WxShare = function (config) {

    /**
     *      config:
     *             title,text,link,imgUrl,cbErr,debug
     *             enable:是否启用分享，如果是false，则禁止分享
     *             onMenuShareAppMessageOk
     *             onMenuShareAppMessageCancel
     *             onMenuShareTimelineOk
     *             onMenuShareAppMessageCancel
     *
     * **/

    var emsg = null;

    if (!Base64) {
        emsg = 'WxShare error: require "h5base/pub/static/js/Base64.js"';
    } else if (!$ || !$.get) {
        emsg = 'WxShare error: require "$.get"';
    } else if (!wx) {
        emsg = 'WxShare error: require "http://res.wx.qq.com/open/js/jweixin-1.0.0.js"';
    }

    if (emsg) {
        alert(emsg);
        console.log(emsg);
        return;
    }


    var jsApiList;

    if (config.enable !== false) {
        jsApiList = ["onMenuShareTimeline", "onMenuShareAppMessage"];
    } else {
        jsApiList = ["hideOptionMenu"];
    }

    if (config.apiList) {
        for (var i = 0; i < config.apiList.length; i++) {
            jsApiList.push(config.apiList[i]);
        }
    }

    var appId, timestamp, nonceStr, signature;

    var debug = config.debug == undefined ? false : config.debug;

    $.get("http://weixin.chetuobang.com/h5base/pub/proxy/http_weixintoken.php?url=" + Base64.base64_encode(location.href),
        function (data) {
            data = JSON.parse(data);
            appId = data.appId;
            timestamp = data.timestamp;
            nonceStr = data.nonceStr;
            signature = data.signature;
            me.data = data;
            wx.config({
                debug: debug, //true alert调试
                appId: appId,
                timestamp: timestamp,
                nonceStr: nonceStr,
                signature: signature,
                jsApiList: jsApiList
            });
        });

    function onWeiXinReady() {

        me.onWeiXinReady = true;

        if (config.enable === false) {
            wx.hideOptionMenu();
            return;
        }

        //分享给朋友
        wx.onMenuShareAppMessage({
            title: config.title,
            desc: config.text,
            link: config.link,
            imgUrl: config.imgUrl,
            type: 'link',
            dataUrl: '',
            success: function () {
                config.onMenuShareAppMessageOk && config.onMenuShareAppMessageOk();
            },
            cancel: function () {
                config.onMenuShareAppMessageCancel && config.onMenuShareAppMessageCancel();
            }
        });

        //分享到朋友圈
        wx.onMenuShareTimeline({
            title: config.text,
            link: config.link,
            imgUrl: config.imgUrl,
            success: function () {
                config.onMenuShareTimelineOk && config.onMenuShareTimelineOk();
            },
            cancel: function () {
                config.onMenuShareTimelineCancel && config.onMenuShareTimelineCancel();
            }
        });

    }

    wx.ready(onWeiXinReady);

    wx.error(function (res) {
        //alert(JSON.stringify(res));
        alert("WxShare error:" + JSON.stringify(res));
        config.cbErr && config.cbErr({
            data: res
        });
    });

    var me = {};
    me.config = config;
    return me;
};