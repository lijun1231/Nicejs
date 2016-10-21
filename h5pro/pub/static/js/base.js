/**
 * Created by Administrator on 2015/12/15.
 */
Array.prototype.inArray = function (elem) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == elem) return true;
    }
    return false;
};
Array.prototype.indexOf = function (elem) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == elem) return i;
    }
    return -1;
};
Array.prototype.copy = function () {
    return this.slice();
};

Array.prototype.remove = function (elem) {
    var index = this.indexOf(elem);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.each = function (fn) {
    if (typeof fn != 'function') {
        return;
    }
    var len = this.length;
    for (var k = 0; k < len; k++) {
        var v = this[k];
        fn(k, v);
    }
};
String.prototype.isEmpty = function () {
    if (this.replace(/(^\s*)|(\s*$)/g, '').length <= 0) {//null
        return true;
    } else {// not null
        return false;
    }
};
String.prototype.notEmpty = function () {
    return !this.isEmpty();
};

String.prototype.trim = function () {
    return this.replace(/^\s*/img, "").replace(/\s*$/img, "");
};

/**
 * 获取字节长度，中文两个字节
 * @return {}
 */
String.prototype.byteLength = function () {
    var strLen = 0;
    for (var i = 0; i < this.length; i++) {
        if (this.charCodeAt(i) > 127 || this.charCodeAt(i) == 94) {
            strLen += 2;
        } else {
            strLen++;
        }
    }
    return strLen;
};
String.prototype.escapeHTML = function () {
    return this.replace(/&/g, '&amp;').replace(/>/g, '&gt;').replace(/</g, '&lt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
};

String.prototype.replaceAll = function (from, to) {
    var c = new RegExp(from, "g");
    return this.replace(c, to);
};

/**
 * 时间对象的格式化;
 */
Date.prototype.format = function (format) {
    /*
     * eg:format="yyyy-MM-dd hh:mm:ss";
     */
    var o = {
        "M+": this.getMonth() + 1, // month
        "d+": this.getDate(), // day
        "h+": this.getHours(), // hour
        "m+": this.getMinutes(), // minute
        "s+": this.getSeconds(), // second
        "q+": Math.floor((this.getMonth() + 3) / 3), // quarter
        "S": this.getMilliseconds()
        // millisecond
    };

    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + "")
            .substr(4 - RegExp.$1.length));
    }

    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ? o[k]
                : ("00" + o[k]).substr(("" + o[k]).length));
        }
    }
    return format;
};

function emptyFn() {
}

var H5_BASE = '';//注：需在phpStudy中配置域名指向h5base目录
/*正式环境*/
//var H5_BASE='www.weixin.chetuobang.com/h5base';

/*在正式环境使用，禁用日志输出*/
//if(!console) console={}; console.log=emptyFn;