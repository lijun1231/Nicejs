//创建时间：2015年12月24日 15:08:00
//创建人：李君
//最后更新时间：2015年12月24日 15:08:03
//更新人：李君
//说明：jquery拓展
//拓展插件
!function($){
    $.extend({
        //创建者：李君
        //创建时间：2015年5月11日 13:10:36
        //说明：发送验证码

        //传入参数解释：
        //传入参数如果为对象，则分别为：
        //bt:激发按钮
        //type:激发事件，默认为"touchend"
        //delay:重发时间
        //callback:回调函数
        //fnWrong:手机号码错误调用函数，若有则做检验，若无则不做检验
        //num:用于检验格式的手机号码，需要检验手机号码时才使用
        VerifiCode: function (o) {
            var type= o.type? o.type:"touchend";
            //验证手机
            function checkMobile(sMobile) {
                if (!(/^1[3|4|5|7|8][0-9]\d{8}$/.test(sMobile))) {
                    return false;
                } else {
                    return true;
                }
            }
            o.bt.on(type, countTime);
            function countTime() {
                if(o.fnWrong){
                    var phoneNum = o.num.val().trim();
                    if(!checkMobile(phoneNum)){
                        o.fnWrong();//手机号码错误时调用
                        return;
                    }
                }
                //回调函数
                if (o.callback) {
                    (o.callback)();
                }
                //开始循环
                var timer = o.delay;
                o.bt.off(type, countTime);
                var stv = setInterval(function () {
                    timer--;
                    o.bt.css("background","#adadad");
                    o.bt.val(timer + '秒后重发');
                    o.bt.text(timer + '秒后重发');
                    if (timer == 0) {
                        o.bt.css("background","#09bb07");
                        o.bt.val('立即重发');
                        o.bt.text('立即重发');
                        clearInterval(stv);
                        o.bt.on(type, countTime);
                    }
                }, 1000);
            }

        },

        //创建者：李君
        //创建时间：2015年9月18日 12:54:32
        //说明：手机端日期时间插件

        //传入参数解释：
        //传入参数如果为对象，则分别为：
        //tar:重发时间
        //type:类型，time、date、datetime。默认为date
        mobileDate: function (o) {
            var type=o.type?o.type:"date";
            var curr = new Date().getFullYear();
            var opt = {}
            opt.time = { preset: 'time' };
            opt.date = { preset: 'date' };
            opt.datetime = {
                preset: type,
                minDate: new Date(),
                maxDate: new Date(2050, 7, 30, 15, 44),
                stepMinute: 5
            };
            opt.tree_list = {
                preset: 'list',
                labels: ['Region', 'Country', 'City']
            };
            opt.image_text = {
                preset: 'list',
                labels: ['Cars']
            };
            opt.select = { preset: 'select' };
            o.tar.val('').scroller('destroy').scroller(
                $.extend(opt[type],{
                    theme: "Default",
                    mode: "scroller",
                    display: "Bottom",
                    lang: "zh",
                    dateFormat: 'yy-mm-dd'
                    // monthText: "月",
                    // dayText: "日",
                    // yearText: "年",
                    // hourText: "时",
                    // minuteText: "分",
                    // ampmText: "上午/下午",
                    // setText: '确定',
                    // cancelText: '取消',
                })
            );
        },
        //创建时间：2015年6月2日 17:48:46
        //说明：数量加减
        //传入参数：对象，对象属性如下
        //说明：
        //box：容器
        //min：最小值，默认为0
        //max：最大值，默认为10000
        //type：触发方式，可空，默认为touchend
        //onchange:数量发生变化的回调函数，可空
        numPlusMinus: function (o) {
            var $box = o.box;
            var min = o.min?o.min:0;
            var max = o.max ? o.max:(o.max==0? o.max:10000);
            var type= o.type? o.type:"touchend";
            var $inp = $box.children("input");
            $inp.before("<i class=\"bt minus\">-</i>");
            $inp.after("<i class=\"bt plus\">+</i>");
            var $btm = $box.children(".minus");
            var $btp = $box.children(".plus");
            var num = parseInt($inp.val());
            btAble();//初始化按钮状态
            //按钮减
            $btm.each(function(){
                this.addEventListener(type,function(){
                    if (num > min) {
                        num--;
                        $inp.val(num);
                        if(o.onchange){o.onchange(num);}
                        btAble();
                    }
                },false);
            });
            //按钮加
            $btp.each(function(){
                this.addEventListener(type,function(){
                    if (num < max) {
                        num++;
                        $inp.val(num);
                        if(o.onchange){o.onchange(num);}
                        btAble();
                    }
                },false);
            });
            //按钮加
            //手动输入
            $inp.keyup(function () {
                var inpNum = parseInt($(this).val());
                num = inpNum > max ? max : (inpNum < min ? min : inpNum);
                $(this).val(num);
                if(o.onchange){o.onchange(num);}
                btAble();
            })
            //设置按钮的可点击状态
            function btAble() {
                if (num >= max) {
                    $btp.removeClass("able").addClass("disable").empty();
                } else {
                    $btp.addClass("able").removeClass("disable").text("+");
                }
                if (num <= min) {
                    $btm.removeClass("able").addClass("disable").empty();
                } else {
                    $btm.addClass("able").removeClass("disable").text("-");
                }
            }
        },
        //创建者：李君
        //创建时间：2016年3月15日 17:45:06
        //说明：仿开关

        //传入参数解释：
        //传入参数如果为对象，则分别为：
        //bt:应用对象，不可空
        //autoOpen:默认状态，可空，默认为false即默认关闭
        //fn:回调函数并回传状态，可空
        switchOnOff:function(o){
            var autoOpen=o.autoOpen||false;
            var $i=$("<i></i>").appendTo(o.bt);
            var bw=o.bt.width();
            var iw=$i.width();
            o.bt.on("touchend",function(){
                var status=$(this).hasClass("on");
                var $self=$(this);
                $i.animate({
                    width:bw
                },200,function(){
                    $i.animate({
                        width:iw
                    },400);
                    if(status){
                        $self.removeClass("on").addClass("off");
                    }else{
                        $self.removeClass("off").addClass("on");
                    }
                });
            });
        }
    });
    $.fn.extend({
        //时间：2015年5月17日 22:03:59
        //作者：李君
        //说明：弹出层
        //传入参数解释：
        //传入参数如果为对象，则分别为：
        //autoOpen: 是否自动打开
        //scale: 页面是否缩放
        //scaleTarget:（如果要缩放）缩放对象
        //layer:是否添加暗层
        //layerClose:单击暗层是否关闭弹窗
        //closeBt:是否含关闭按钮
        //buttonDisplay:按钮排列方式，h表示横向，v表示纵向
        //buttons:按钮对象数组，可空
        //type:激发事件。默认为touchend

        //传入参数如果为字符串
        //若为: open，则表示打开弹出层
        //若为：close，测表示关闭弹出层
        bottomUp: function (o) {
            var othis = this;
            if (typeof (o) == "string") {
                var scale = $(this).attr("scale")!=''?$(this).attr("scale"):"true";
                if(scale=="true"){
                    var $scaleTarget = $($(this).attr("scaleTarget"));
                }
                var layer = $(this).attr("layer") != '' ? $(this).attr("layer") : true;
                if(o == "open") {//打开弹窗
                    $(this).fadeIn(300);
                    if (scale == "true") {//缩放页面
                        $scaleTarget.addClass("small");
                    }
                    if (layer == "true") {//显示遮罩层
                        $(document).find(".model-pop-layer").fadeIn(300);
                    }
                }else if (o == "close") {//关闭弹窗
                    $(this).fadeOut(300);
                    if (scale == "true") {//还原缩放页面
                        $scaleTarget.removeClass("small");
                    }
                    if (layer == "true") {//隐藏遮罩层
                        $(document).find(".model-pop-layer").fadeOut(300);
                    }
                }
            } else if (typeof (o) == "object") {//初始化弹窗
                var $othis=$(this);
                var type= o.type? o.type:"touchend";
                $(this).attr("scale", o.scale);
                $(this).attr("scaleTarget", o.scaleTarget);
                $(this).attr("layer", o.layer);
                if (o.layer == true) {//添加遮罩层
                    if ($(document).find(".model-pop-layer").length == 0) {
                        var str = "<div class=\"model-pop-layer\" style=\"display:none;\"></div>";
                        $("body").append(str);
                    }
                    //单击暗层是否关闭弹窗
                    if(o.layerClose==true){
                        $(document).find(".model-pop-layer")[0].addEventListener(type,function(){
                            $othis.bottomUp("close");
                        },false);
                    }
                }
                if($(this).attr("title")){
                    $(this).prepend("<div class=\"model-pop-hd\">" + $(this).attr("title") + "</div>");
                }
                $scaleTarget = o.scaleTarget;
                var disp = o.buttonDisplay ? o.buttonDisplay : "v";
                //设置是否自动打开
                if (!o.autoOpen) {
                    $(this).bottomUp("close");
                } else {
                    $(this).bottomUp("open");
                }
                //设置垂直位置居中
                var oWin={
                    w:$(window).width(),
                    h:$(window).height()
                }
                var oSize={
                    w:$(this).width(),
                    h:$(this).height()
                }
                var oSizeH = $(this).height();
                //若header向上溢出
                var nhdOut = parseInt($(this).find(".model-pop-hd").css("marginTop"));
                if (nhdOut < 0) {
                    oSize.h -= nhdOut;
                }
                //$(this).css({
                //    "top": ~~((oWin.h - oSize.h) / 2) - nhdOut
                //})
                //是否含关闭按钮
                if (o.closeBt) {
                    $(this).append("<div class=\"model-pop-closeBt\"></div>");
                    $(this).find(".model-pop-closeBt")[0].addEventListener(type,function () {
                        $(othis).bottomUp("close");
                    },false);
                }
                //按钮组
                if(o.buttons&&o.buttons.length>0){
                    $(this).append("<div class=\"model-pop-bts\"></div>");
                    var strButtons = "";
                    for (var i = 0; i < o.buttons.length; i++) {
                        var obt = o.buttons[i];
                        if (obt.classNa) {
                            strButtons += "<button class=\"model-pop-bt " + obt.classNa + "\">" + obt.title + "</button>";
                        }else{
                            strButtons += "<button class=\"model-pop-bt\">" + obt.title + "</button>";
                        }
                    }
                    var $myBts = $(this).children(".model-pop-bts");
                    $myBts.append(strButtons);//添加按钮
                    var $bts=$myBts.children(".model-pop-bt");
                    $bts.each(function () {
                        var ind = $(this).index();
                        this.addEventListener(type, o.buttons[ind].cli, false);
                    });
                    //按钮排列方式
                    if (disp == "h") {
                        $bts.eq(0).css({
                            "width":"47%",
                            "float":"left"
                        });
                        $bts.eq(1).css({
                            "width":"47%",
                            "float":"right"
                        });
                    }
                }
            }
        }
    });
}(jQuery);



































