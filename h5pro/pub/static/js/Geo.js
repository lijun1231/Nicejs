/************************************
 * Created by Great Fan on 2015/12/28.
 ************************************/

function Geo(config) {

    var gps84ToGcj02 = {

        BAIDU_LBS_TYPE: "bd09ll",
        pi: 3.1415926535897932384626,
        a: 6378245.0,
        ee: 0.00669342162296594323,

        /**
         * 84 to 火星坐标系 (GCJ-02) World Geodetic System ==> Mars Geodetic System
         *
         * @param lat
         * @param lon
         * @return
         */
        gps84_To_Gcj02: function (lat, lon) {
            if (gps84ToGcj02.outOfChina(lat, lon)) {
                return null;
            }
            var dLat = gps84ToGcj02.transformLat(lon - 105.0, lat - 35.0);
            var dLon = gps84ToGcj02.transformLon(lon - 105.0, lat - 35.0);
            var radLat = lat / 180.0 * gps84ToGcj02.pi;
            var magic = Math.sin(radLat);
            magic = 1 - gps84ToGcj02.ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((gps84ToGcj02.a * (1 - gps84ToGcj02.ee)) / (magic * sqrtMagic) * gps84ToGcj02.pi);
            dLon = (dLon * 180.0) / (gps84ToGcj02.a / sqrtMagic * Math.cos(radLat) * gps84ToGcj02.pi);
            var mgLat = lat + dLat;
            var mgLon = lon + dLon;
            return {"wgLat": mgLat, "wgLon": mgLon};
        },
        outOfChina: function (lat, lon) {
            if (lon < 72.004 || lon > 137.8347)
                return true;
            if (lat < 0.8293 || lat > 55.8271)
                return true;
            return false;
        },
        transform: function (lat, lon) {
            if (gps84ToGcj02.outOfChina(lat, lon)) {
                return {"wgLat": lat, "wgLon": lon};
            }
            var dLat = gps84ToGcj02.transformLat(lon - 105.0, lat - 35.0);
            var dLon = gps84ToGcj02.transformLon(lon - 105.0, lat - 35.0);
            var radLat = lat / 180.0 * gps84ToGcj02.pi;
            var magic = Math.sin(radLat);
            magic = 1 - gps84ToGcj02.ee * magic * magic;
            var sqrtMagic = Math.sqrt(magic);
            dLat = (dLat * 180.0) / ((gps84ToGcj02.a * (1 - gps84ToGcj02.ee)) / (magic * sqrtMagic) * gps84ToGcj02.pi);
            dLon = (dLon * 180.0) / (gps84ToGcj02.a / sqrtMagic * Math.cos(radLat) * gps84ToGcj02.pi);
            var mgLat = lat + dLat;
            var mgLon = lon + dLon;
            return {"wgLat": mgLat, "wgLon": mgLon};
        },
        transformLat: function (x, y) {
            var ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * gps84ToGcj02.pi) + 20.0 * Math.sin(2.0 * x * gps84ToGcj02.pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(y * gps84ToGcj02.pi) + 40.0 * Math.sin(y / 3.0 * gps84ToGcj02.pi)) * 2.0 / 3.0;
            ret += (160.0 * Math.sin(y / 12.0 * gps84ToGcj02.pi) + 320 * Math.sin(y * gps84ToGcj02.pi / 30.0)) * 2.0 / 3.0;
            return ret;
        },
        transformLon: function (x, y) {
            var ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
            ret += (20.0 * Math.sin(6.0 * x * gps84ToGcj02.pi) + 20.0 * Math.sin(2.0 * x * gps84ToGcj02.pi)) * 2.0 / 3.0;
            ret += (20.0 * Math.sin(x * gps84ToGcj02.pi) + 40.0 * Math.sin(x / 3.0 * gps84ToGcj02.pi)) * 2.0 / 3.0;
            ret += (150.0 * Math.sin(x / 12.0 * gps84ToGcj02.pi) + 300.0 * Math.sin(x / 30.0 * gps84ToGcj02.pi)) * 2.0 / 3.0;
            return ret;
        }
    };

    var emptyFn = function () {
    };

    var me = {
        citys: [{"admin": 110000, "name": "北京市", "lon": 53640424, "lat": 18388081},
            {"admin": 120000, "name": "天津市", "lon": 54005470, "lat": 18010414},
            {"admin": 130100, "name": "石家庄市", "lon": 52768189, "lat": 17530104},
            {"admin": 130200, "name": "唐山市", "lon": 54457611, "lat": 18261725},
            {"admin": 130300, "name": "秦皇岛市", "lon": 55111514, "lat": 18402255},
            {"admin": 130400, "name": "邯郸市", "lon": 52779654, "lat": 16877058},
            {"admin": 130500, "name": "邢台市", "lon": 52763641, "lat": 17082109},
            {"admin": 130600, "name": "保定市", "lon": 53206083, "lat": 17913121},
            {"admin": 130700, "name": "张家口市", "lon": 52940183, "lat": 18811902},
            {"admin": 130800, "name": "承德市", "lon": 54357535, "lat": 18870451},
            {"admin": 130900, "name": "沧州市", "lon": 53839268, "lat": 17650672},
            {"admin": 131000, "name": "廊坊市", "lon": 53767877, "lat": 18218995},
            {"admin": 131100, "name": "衡水市", "lon": 53300985, "lat": 17390067},
            {"admin": 140100, "name": "太原市", "lon": 51863349, "lat": 17450768},
            {"admin": 140200, "name": "大同市", "lon": 52208645, "lat": 18467191},
            {"admin": 140300, "name": "阳泉市", "lon": 52337881, "lat": 17444358},
            {"admin": 140400, "name": "长治市", "lon": 52124079, "lat": 16679029},
            {"admin": 140500, "name": "晋城市", "lon": 52001801, "lat": 16353972},
            {"admin": 140600, "name": "朔州市", "lon": 51808578, "lat": 18123997},
            {"admin": 140700, "name": "晋中市", "lon": 51956481, "lat": 17366179},
            {"admin": 140800, "name": "运城市", "lon": 51152021, "lat": 16140110},
            {"admin": 140900, "name": "忻州市", "lon": 51947910, "lat": 17702415},
            {"admin": 141000, "name": "临汾市", "lon": 51388241, "lat": 16629452},
            {"admin": 141100, "name": "吕梁市", "lon": 51214072, "lat": 17288912},
            {"admin": 150000, "name": "内蒙古自治区", "lon": 51501413, "lat": 18808626},
            {"admin": 150100, "name": "呼和浩特市", "lon": 51495317, "lat": 18819759},
            {"admin": 150200, "name": "包头市", "lon": 50614392, "lat": 18734916},
            {"admin": 150300, "name": "乌海市", "lon": 49211348, "lat": 18272489},
            {"admin": 150400, "name": "赤峰市", "lon": 54784024, "lat": 19472763},
            {"admin": 150500, "name": "通辽市", "lon": 56330353, "lat": 20115058},
            {"admin": 150600, "name": "鄂尔多斯市", "lon": 50587426, "lat": 18251297},
            {"admin": 150700, "name": "呼伦贝尔市", "lon": 55188099, "lat": 22676719},
            {"admin": 150800, "name": "巴彦淖尔市", "lon": 49484266, "lat": 18774453},
            {"admin": 150900, "name": "乌兰察布市", "lon": 52132037, "lat": 18889994},
            {"admin": 152200, "name": "兴安盟", "lon": 56235193, "lat": 21234622},
            {"admin": 152500, "name": "锡林郭勒盟", "lon": 53474803, "lat": 20244419},
            {"admin": 152900, "name": "阿拉善盟", "lon": 48719914, "lat": 17902785},
            {"admin": 210100, "name": "沈阳市", "lon": 56877631, "lat": 19264034},
            {"admin": 210200, "name": "大连市", "lon": 56040081, "lat": 17931428},
            {"admin": 210300, "name": "鞍山市", "lon": 56675912, "lat": 18942460},
            {"admin": 210400, "name": "抚顺市", "lon": 57119487, "lat": 19298170},
            {"admin": 210500, "name": "本溪市", "lon": 57031769, "lat": 19028335},
            {"admin": 210600, "name": "丹东市", "lon": 57303249, "lat": 18431908},
            {"admin": 210700, "name": "锦州市", "lon": 55815335, "lat": 18936645},
            {"admin": 210800, "name": "营口市", "lon": 56325842, "lat": 18739275},
            {"admin": 210900, "name": "阜新市", "lon": 56065587, "lat": 19363581},
            {"admin": 211000, "name": "辽阳市", "lon": 56787775, "lat": 19016336},
            {"admin": 211100, "name": "盘锦市", "lon": 56250215, "lat": 18948078},
            {"admin": 211200, "name": "铁岭市", "lon": 57066583, "lat": 19485481},
            {"admin": 211300, "name": "朝阳市", "lon": 55503729, "lat": 19157055},
            {"admin": 211400, "name": "葫芦岛市", "lon": 55681685, "lat": 18759629},
            {"admin": 220100, "name": "长春市", "lon": 57749101, "lat": 20190422},
            {"admin": 220200, "name": "吉林市", "lon": 58313982, "lat": 20200477},
            {"admin": 220300, "name": "四平市", "lon": 57300646, "lat": 19891105},
            {"admin": 220400, "name": "辽源市", "lon": 57666208, "lat": 19762813},
            {"admin": 220500, "name": "通化市", "lon": 58033106, "lat": 19228396},
            {"admin": 220600, "name": "白山市", "lon": 58256377, "lat": 19326321},
            {"admin": 220700, "name": "松原市", "lon": 57519429, "lat": 20801019},
            {"admin": 220800, "name": "白城市", "lon": 56604078, "lat": 21021512},
            {"admin": 222400, "name": "延边朝鲜族自治州", "lon": 59677793, "lat": 19764260},
            {"admin": 230100, "name": "哈尔滨市", "lon": 58307697, "lat": 21105635},
            {"admin": 230200, "name": "齐齐哈尔市", "lon": 57101396, "lat": 21820866},
            {"admin": 230300, "name": "鸡西市", "lon": 60350764, "lat": 20872047},
            {"admin": 230400, "name": "鹤岗市", "lon": 60041249, "lat": 21818829},
            {"admin": 230500, "name": "双鸭山市", "lon": 60438113, "lat": 21494744},
            {"admin": 230600, "name": "大庆市", "lon": 57647495, "lat": 21467557},
            {"admin": 230700, "name": "伊春市", "lon": 59369698, "lat": 21992841},
            {"admin": 230800, "name": "佳木斯市", "lon": 60051732, "lat": 21565528},
            {"admin": 230900, "name": "七台河市", "lon": 60366210, "lat": 21091116},
            {"admin": 231000, "name": "牡丹江市", "lon": 59734628, "lat": 20529880},
            {"admin": 231100, "name": "黑河市", "lon": 58765142, "lat": 23153002},
            {"admin": 231200, "name": "绥化市", "lon": 58507463, "lat": 21497454},
            {"admin": 232700, "name": "大兴安岭地区", "lon": 57412067, "lat": 23926570},
            {"admin": 310000, "name": "上海市", "lon": 55975104, "lat": 14390904},
            {"admin": 320100, "name": "南京市", "lon": 54741413, "lat": 14772502},
            {"admin": 320200, "name": "无锡市", "lon": 55439940, "lat": 14511048},
            {"admin": 320300, "name": "徐州市", "lon": 54045283, "lat": 15761388},
            {"admin": 320400, "name": "常州市", "lon": 55283858, "lat": 14658380},
            {"admin": 320500, "name": "苏州市", "lon": 55564734, "lat": 14422275},
            {"admin": 320600, "name": "南通市", "lon": 55707822, "lat": 14736190},
            {"admin": 320700, "name": "连云港市", "lon": 54937935, "lat": 15942155},
            {"admin": 320800, "name": "淮安市", "lon": 54842550, "lat": 15487562},
            {"admin": 320900, "name": "盐城市", "lon": 55370484, "lat": 15367454},
            {"admin": 321000, "name": "扬州市", "lon": 55025368, "lat": 14926962},
            {"admin": 321100, "name": "镇江市", "lon": 55031040, "lat": 14832963},
            {"admin": 321200, "name": "泰州市", "lon": 55261689, "lat": 14955476},
            {"admin": 321300, "name": "宿迁市", "lon": 54501346, "lat": 15649657},
            {"admin": 330100, "name": "杭州市", "lon": 55367493, "lat": 13950328},
            {"admin": 330200, "name": "宁波市", "lon": 56010364, "lat": 13765875},
            {"admin": 330300, "name": "温州市", "lon": 55618279, "lat": 12900059},
            {"admin": 330400, "name": "嘉兴市", "lon": 55644134, "lat": 14167301},
            {"admin": 330500, "name": "湖州市", "lon": 55336573, "lat": 14235517},
            {"admin": 330600, "name": "绍兴市", "lon": 55563356, "lat": 13837976},
            {"admin": 330700, "name": "金华市", "lon": 55133609, "lat": 13399198},
            {"admin": 330800, "name": "衢州市", "lon": 54777227, "lat": 13333672},
            {"admin": 330900, "name": "舟山市", "lon": 56313345, "lat": 13817268},
            {"admin": 331000, "name": "台州市", "lon": 55950594, "lat": 13204735},
            {"admin": 331100, "name": "丽水市", "lon": 55260486, "lat": 13117686},
            {"admin": 340100, "name": "合肥市", "lon": 54019128, "lat": 14662919},
            {"admin": 340200, "name": "芜湖市", "lon": 54574023, "lat": 14446803},
            {"admin": 340300, "name": "蚌埠市", "lon": 54092999, "lat": 15167453},
            {"admin": 340400, "name": "淮南市", "lon": 53913508, "lat": 15033826},
            {"admin": 340500, "name": "马鞍山市", "lon": 54607615, "lat": 14593845},
            {"admin": 340600, "name": "淮北市", "lon": 53820675, "lat": 15646367},
            {"admin": 340700, "name": "铜陵市", "lon": 54287917, "lat": 14259391},
            {"admin": 340800, "name": "安庆市", "lon": 53942879, "lat": 14074187},
            {"admin": 341000, "name": "黄山市", "lon": 54530455, "lat": 13692750},
            {"admin": 341100, "name": "滁州市", "lon": 54520395, "lat": 14884674},
            {"admin": 341200, "name": "阜阳市", "lon": 53367529, "lat": 15155542},
            {"admin": 341300, "name": "宿州市", "lon": 53896970, "lat": 15504141},
            {"admin": 341500, "name": "六安市", "lon": 53693909, "lat": 14623433},
            {"admin": 341600, "name": "亳州市", "lon": 53351106, "lat": 15595596},
            {"admin": 341700, "name": "池州市", "lon": 54140046, "lat": 14130289},
            {"admin": 341800, "name": "宣城市", "lon": 54723991, "lat": 14257511},
            {"admin": 350100, "name": "福州市", "lon": 54971813, "lat": 12014996},
            {"admin": 350200, "name": "厦门市", "lon": 54415632, "lat": 11280158},
            {"admin": 350300, "name": "莆田市", "lon": 54838753, "lat": 11729203},
            {"admin": 350400, "name": "三明市", "lon": 54208153, "lat": 12102382},
            {"admin": 350500, "name": "泉州市", "lon": 54685841, "lat": 11461889},
            {"admin": 350600, "name": "漳州市", "lon": 54211853, "lat": 11295807},
            {"admin": 350700, "name": "南平市", "lon": 54456344, "lat": 12276412},
            {"admin": 350800, "name": "龙岩市", "lon": 53921535, "lat": 11554578},
            {"admin": 350900, "name": "宁德市", "lon": 55087806, "lat": 12287559},
            {"admin": 360100, "name": "南昌市", "lon": 53387339, "lat": 13216675},
            {"admin": 360200, "name": "景德镇市", "lon": 53995802, "lat": 13487012},
            {"admin": 360300, "name": "萍乡市", "lon": 52464048, "lat": 12728628},
            {"admin": 360400, "name": "九江市", "lon": 53453473, "lat": 13688285},
            {"admin": 360500, "name": "新余市", "lon": 52953814, "lat": 12818424},
            {"admin": 360600, "name": "鹰潭市", "lon": 53945483, "lat": 13022296},
            {"admin": 360700, "name": "赣州市", "lon": 52961937, "lat": 11902966},
            {"admin": 360800, "name": "吉安市", "lon": 52989125, "lat": 12494048},
            {"admin": 360900, "name": "宜春市", "lon": 52722948, "lat": 12816889},
            {"admin": 361000, "name": "抚州市", "lon": 53617808, "lat": 12878351},
            {"admin": 361100, "name": "上饶市", "lon": 54348397, "lat": 13111894},
            {"admin": 370100, "name": "济南市", "lon": 53911264, "lat": 16895366},
            {"admin": 370200, "name": "青岛市", "lon": 55472482, "lat": 16619319},
            {"admin": 370300, "name": "淄博市", "lon": 54399652, "lat": 16963476},
            {"admin": 370400, "name": "枣庄市", "lon": 54061959, "lat": 16040775},
            {"admin": 370500, "name": "东营市", "lon": 54685283, "lat": 17249426},
            {"admin": 370600, "name": "烟台市", "lon": 55963243, "lat": 17263195},
            {"admin": 370700, "name": "潍坊市", "lon": 54909739, "lat": 16914521},
            {"admin": 370800, "name": "济宁市", "lon": 53723400, "lat": 16319043},
            {"admin": 370900, "name": "泰安市", "lon": 53954335, "lat": 16680932},
            {"admin": 371000, "name": "威海市", "lon": 56273684, "lat": 17286212},
            {"admin": 371100, "name": "日照市", "lon": 55078129, "lat": 16319905},
            {"admin": 371200, "name": "莱芜市", "lon": 54225410, "lat": 16687222},
            {"admin": 371300, "name": "临沂市", "lon": 54538657, "lat": 16176223},
            {"admin": 371400, "name": "德州市", "lon": 53618352, "lat": 17250278},
            {"admin": 371500, "name": "聊城市", "lon": 53446114, "lat": 16799395},
            {"admin": 371600, "name": "滨州市", "lon": 54361862, "lat": 17225676},
            {"admin": 371700, "name": "菏泽市", "lon": 53213714, "lat": 16235657},
            {"admin": 410100, "name": "郑州市", "lon": 52358368, "lat": 16011533},
            {"admin": 410200, "name": "开封市", "lon": 52672808, "lat": 16034577},
            {"admin": 410300, "name": "洛阳市", "lon": 51818623, "lat": 15952030},
            {"admin": 410400, "name": "平顶山市", "lon": 52159063, "lat": 15559414},
            {"admin": 410500, "name": "安阳市", "lon": 52712340, "lat": 16633825},
            {"admin": 410600, "name": "鹤壁市", "lon": 52668265, "lat": 16472218},
            {"admin": 410700, "name": "新乡市", "lon": 52497446, "lat": 16267728},
            {"admin": 410800, "name": "焦作市", "lon": 52181918, "lat": 16227362},
            {"admin": 410900, "name": "濮阳市", "lon": 53005511, "lat": 16479079},
            {"admin": 411000, "name": "许昌市", "lon": 52463154, "lat": 15683651},
            {"admin": 411100, "name": "漯河市", "lon": 52538946, "lat": 15474351},
            {"admin": 411200, "name": "三门峡市", "lon": 51241098, "lat": 16023219},
            {"admin": 411300, "name": "南阳市", "lon": 51853137, "lat": 15202128},
            {"admin": 411400, "name": "商丘市", "lon": 53294446, "lat": 15858096},
            {"admin": 411500, "name": "信阳市", "lon": 52573958, "lat": 14813402},
            {"admin": 411600, "name": "周口市", "lon": 52852355, "lat": 15494782},
            {"admin": 411700, "name": "驻马店市", "lon": 52541794, "lat": 15211662},
            {"admin": 420100, "name": "武汉市", "lon": 52671859, "lat": 14097144},
            {"admin": 420200, "name": "黄石市", "lon": 53009925, "lat": 13915943},
            {"admin": 420300, "name": "十堰市", "lon": 51055723, "lat": 15035526},
            {"admin": 420500, "name": "宜昌市", "lon": 51280782, "lat": 14142809},
            {"admin": 420600, "name": "襄阳市", "lon": 51666071, "lat": 14749747},
            {"admin": 420700, "name": "鄂州市", "lon": 52943593, "lat": 14004104},
            {"admin": 420800, "name": "荆门市", "lon": 51701507, "lat": 14301140},
            {"admin": 420900, "name": "孝感市", "lon": 52492700, "lat": 14250162},
            {"admin": 421000, "name": "荆州市", "lon": 51720510, "lat": 13978271},
            {"admin": 421100, "name": "黄冈市", "lon": 52933193, "lat": 14032959},
            {"admin": 421200, "name": "咸宁市", "lon": 52679785, "lat": 13750853},
            {"admin": 421300, "name": "随州市", "lon": 52246711, "lat": 14602812},
            {"admin": 422800, "name": "恩施土家族苗族自治州", "lon": 50452149, "lat": 13949416},
            {"admin": 430100, "name": "长沙市", "lon": 52042227, "lat": 13007361},
            {"admin": 430200, "name": "株洲市", "lon": 52132129, "lat": 12822990},
            {"admin": 430300, "name": "湘潭市", "lon": 52044646, "lat": 12823949},
            {"admin": 430400, "name": "衡阳市", "lon": 51873155, "lat": 12392405},
            {"admin": 430500, "name": "邵阳市", "lon": 51364316, "lat": 12551685},
            {"admin": 430600, "name": "岳阳市", "lon": 52129931, "lat": 13527835},
            {"admin": 430700, "name": "常德市", "lon": 51470687, "lat": 13377752},
            {"admin": 430800, "name": "张家界市", "lon": 50908442, "lat": 13416962},
            {"admin": 430900, "name": "益阳市", "lon": 51773258, "lat": 13157642},
            {"admin": 431000, "name": "郴州市", "lon": 52077243, "lat": 11875106},
            {"admin": 431100, "name": "永州市", "lon": 51430925, "lat": 12174493},
            {"admin": 431200, "name": "怀化市", "lon": 50688737, "lat": 12704136},
            {"admin": 431300, "name": "娄底市", "lon": 51607102, "lat": 12762907},
            {"admin": 433100, "name": "湘西土家族苗族自治州", "lon": 50567699, "lat": 13046045},
            {"admin": 440100, "name": "广州市", "lon": 52191996, "lat": 10658055},
            {"admin": 440200, "name": "韶关市", "lon": 52345604, "lat": 11432628},
            {"admin": 440300, "name": "深圳市", "lon": 52558645, "lat": 10387750},
            {"admin": 440400, "name": "珠海市", "lon": 52336134, "lat": 10262352},
            {"admin": 440500, "name": "汕头市", "lon": 53767162, "lat": 10761293},
            {"admin": 440600, "name": "佛山市", "lon": 52126581, "lat": 10608468},
            {"admin": 440700, "name": "江门市", "lon": 52108006, "lat": 10404242},
            {"admin": 440800, "name": "湛江市", "lon": 50853400, "lat": 9801833},
            {"admin": 440900, "name": "茂名市", "lon": 51114346, "lat": 9982444},
            {"admin": 441200, "name": "肇庆市", "lon": 51824001, "lat": 10620012},
            {"admin": 441300, "name": "惠州市", "lon": 52723257, "lat": 10649434},
            {"admin": 441400, "name": "梅州市", "lon": 53509313, "lat": 11192113},
            {"admin": 441500, "name": "汕尾市", "lon": 53164865, "lat": 10499632},
            {"admin": 441600, "name": "河源市", "lon": 52854060, "lat": 10941074},
            {"admin": 441700, "name": "阳江市", "lon": 51601711, "lat": 10072507},
            {"admin": 441800, "name": "清远市", "lon": 52096274, "lat": 10912670},
            {"admin": 441900, "name": "东莞市", "lon": 52416742, "lat": 10607616},
            {"admin": 442000, "name": "中山市", "lon": 52251310, "lat": 10375350},
            {"admin": 445100, "name": "潮州市", "lon": 53739860, "lat": 10901007},
            {"admin": 445200, "name": "揭阳市", "lon": 53624545, "lat": 10851711},
            {"admin": 445300, "name": "云浮市", "lon": 51630133, "lat": 10559310},
            {"admin": 450000, "name": "广西壮族自治区", "lon": 49917363, "lat": 10513309},
            {"admin": 450100, "name": "南宁市", "lon": 49935468, "lat": 10513949},
            {"admin": 450200, "name": "柳州市", "lon": 50418672, "lat": 11209158},
            {"admin": 450300, "name": "桂林市", "lon": 50821641, "lat": 11646079},
            {"admin": 450400, "name": "梧州市", "lon": 51277423, "lat": 10818215},
            {"admin": 450500, "name": "北海市", "lon": 50282533, "lat": 9898500},
            {"admin": 450600, "name": "防城港市", "lon": 49929532, "lat": 9993425},
            {"admin": 450700, "name": "钦州市", "lon": 50067906, "lat": 10128246},
            {"admin": 450800, "name": "贵港市", "lon": 50502593, "lat": 10650498},
            {"admin": 450900, "name": "玉林市", "lon": 50771396, "lat": 10439198},
            {"admin": 451000, "name": "百色市", "lon": 49129750, "lat": 11014115},
            {"admin": 451100, "name": "贺州市", "lon": 51409866, "lat": 11245114},
            {"admin": 451200, "name": "河池市", "lon": 49805752, "lat": 11378493},
            {"admin": 451300, "name": "来宾市", "lon": 50329673, "lat": 10944968},
            {"admin": 451400, "name": "崇左市", "lon": 49473723, "lat": 10312220},
            {"admin": 460100, "name": "海口市", "lon": 50780109, "lat": 9236377},
            {"admin": 460200, "name": "三亚市", "lon": 50463171, "lat": 8410743},
            {"admin": 460300, "name": "三沙市", "lon": 51763304, "lat": 7756517},
            {"admin": 500000, "name": "重庆市", "lon": 49098576, "lat": 13623418},
            {"admin": 510100, "name": "成都市", "lon": 47953041, "lat": 14086748},
            {"admin": 510300, "name": "自贡市", "lon": 48281905, "lat": 13519503},
            {"admin": 510400, "name": "攀枝花市", "lon": 46871986, "lat": 12249115},
            {"admin": 510500, "name": "泸州市", "lon": 48587936, "lat": 13304079},
            {"admin": 510600, "name": "德阳市", "lon": 48106552, "lat": 14343225},
            {"admin": 510700, "name": "绵阳市", "lon": 48236092, "lat": 14500196},
            {"admin": 510800, "name": "广元市", "lon": 48772717, "lat": 14946274},
            {"admin": 510900, "name": "遂宁市", "lon": 48657130, "lat": 14069542},
            {"admin": 511000, "name": "内江市", "lon": 48410929, "lat": 13630533},
            {"admin": 511100, "name": "乐山市", "lon": 47815092, "lat": 13617658},
            {"admin": 511300, "name": "南充市", "lon": 48895824, "lat": 14209832},
            {"admin": 511400, "name": "眉山市", "lon": 47853412, "lat": 13858800},
            {"admin": 511500, "name": "宜宾市", "lon": 48218895, "lat": 13248599},
            {"admin": 511600, "name": "广安市", "lon": 49136588, "lat": 14034106},
            {"admin": 511700, "name": "达州市", "lon": 49521213, "lat": 14380941},
            {"admin": 511800, "name": "雅安市", "lon": 47480740, "lat": 13831110},
            {"admin": 511900, "name": "巴中市", "lon": 49189170, "lat": 14684383},
            {"admin": 512000, "name": "资阳市", "lon": 48212573, "lat": 13883254},
            {"admin": 513200, "name": "阿坝藏族羌族自治州", "lon": 47105174, "lat": 14699244},
            {"admin": 513300, "name": "甘孜藏族自治州", "lon": 46984338, "lat": 13846727},
            {"admin": 513400, "name": "凉山彝族自治州", "lon": 47124846, "lat": 12847860},
            {"admin": 520100, "name": "贵阳市", "lon": 49135215, "lat": 12278947},
            {"admin": 520200, "name": "六盘水市", "lon": 48305770, "lat": 12254220},
            {"admin": 520300, "name": "遵义市", "lon": 49272068, "lat": 12775887},
            {"admin": 520400, "name": "安顺市", "lon": 48820009, "lat": 12097691},
            {"admin": 522200, "name": "铜仁市", "lon": 50310600, "lat": 12759856},
            {"admin": 522300, "name": "黔西南布依族苗族自治州", "lon": 48339934, "lat": 11561417},
            {"admin": 522400, "name": "毕节市", "lon": 48524562, "lat": 12579135},
            {"admin": 522600, "name": "黔东南苗族侗族自治州", "lon": 49759101, "lat": 12249741},
            {"admin": 522700, "name": "黔南布依族苗族自治州", "lon": 49546257, "lat": 12097968},
            {"admin": 530100, "name": "昆明市", "lon": 47385548, "lat": 11464547},
            {"admin": 530300, "name": "曲靖市", "lon": 47829312, "lat": 11745801},
            {"admin": 530400, "name": "玉溪市", "lon": 47253473, "lat": 11221369},
            {"admin": 530500, "name": "保山市", "lon": 45693762, "lat": 11571633},
            {"admin": 530600, "name": "昭通市", "lon": 47792701, "lat": 12597429},
            {"admin": 530700, "name": "丽江市", "lon": 46184648, "lat": 12375466},
            {"admin": 530800, "name": "普洱市", "lon": 46525243, "lat": 10517857},
            {"admin": 530900, "name": "临沧市", "lon": 46120937, "lat": 11005867},
            {"admin": 532300, "name": "楚雄彝族自治州", "lon": 46783950, "lat": 11540713},
            {"admin": 532500, "name": "红河哈尼族彝族自治州", "lon": 47635476, "lat": 10766233},
            {"admin": 532600, "name": "文山壮族苗族自治州", "lon": 48022290, "lat": 10782024},
            {"admin": 532800, "name": "西双版纳傣族自治州", "lon": 46447437, "lat": 10141051},
            {"admin": 532900, "name": "大理白族自治州", "lon": 46203329, "lat": 11799466},
            {"admin": 533100, "name": "德宏傣族景颇族自治州", "lon": 45427903, "lat": 11258413},
            {"admin": 533300, "name": "怒江傈僳族自治州", "lon": 45553167, "lat": 11896764},
            {"admin": 533400, "name": "迪庆藏族自治州", "lon": 45943165, "lat": 12819032},
            {"admin": 540000, "name": "西藏自治区", "lon": 41986935, "lat": 13661453},
            {"admin": 540100, "name": "拉萨市", "lon": 41985575, "lat": 13660020},
            {"admin": 542100, "name": "昌都地区", "lon": 44776973, "lat": 14349648},
            {"admin": 542200, "name": "山南地区", "lon": 42289058, "lat": 13472433},
            {"admin": 542300, "name": "日喀则地区", "lon": 40956535, "lat": 13486164},
            {"admin": 542400, "name": "那曲地区", "lon": 42417267, "lat": 14504205},
            {"admin": 542500, "name": "阿里地区", "lon": 37397436, "lat": 14009237},
            {"admin": 542600, "name": "林芝地区", "lon": 43481802, "lat": 13662236},
            {"admin": 610100, "name": "西安市", "lon": 50199478, "lat": 15824457},
            {"admin": 610200, "name": "铜川市", "lon": 50201925, "lat": 16080413},
            {"admin": 610300, "name": "宝鸡市", "lon": 49414957, "lat": 15833982},
            {"admin": 610400, "name": "咸阳市", "lon": 50093241, "lat": 15818951},
            {"admin": 610500, "name": "渭南市", "lon": 50462277, "lat": 15897586},
            {"admin": 610600, "name": "延安市", "lon": 50452891, "lat": 16858502},
            {"admin": 610700, "name": "汉中市", "lon": 49316553, "lat": 15237555},
            {"admin": 610800, "name": "榆林市", "lon": 50565694, "lat": 17641820},
            {"admin": 610900, "name": "安康市", "lon": 50240711, "lat": 15061183},
            {"admin": 611000, "name": "商洛市", "lon": 50660541, "lat": 15607462},
            {"admin": 620100, "name": "兰州市", "lon": 47846786, "lat": 16617084},
            {"admin": 620200, "name": "嘉峪关市", "lon": 45292083, "lat": 18326942},
            {"admin": 620300, "name": "金昌市", "lon": 47088041, "lat": 17750044},
            {"admin": 620400, "name": "白银市", "lon": 47986666, "lat": 16839798},
            {"admin": 620500, "name": "天水市", "lon": 48718015, "lat": 15934856},
            {"admin": 620600, "name": "武威市", "lon": 47295577, "lat": 17477315},
            {"admin": 620700, "name": "张掖市", "lon": 46287272, "lat": 17937064},
            {"admin": 620800, "name": "平凉市", "lon": 49151370, "lat": 16378228},
            {"admin": 620900, "name": "酒泉市", "lon": 45386008, "lat": 18308759},
            {"admin": 621000, "name": "庆阳市", "lon": 49601858, "lat": 16455067},
            {"admin": 621100, "name": "定西市", "lon": 48211311, "lat": 16395785},
            {"admin": 621200, "name": "陇南市", "lon": 48347901, "lat": 15391181},
            {"admin": 622900, "name": "临夏回族自治州", "lon": 47559587, "lat": 16405042},
            {"admin": 623000, "name": "甘南藏族自治州", "lon": 47421398, "lat": 16120286},
            {"admin": 630100, "name": "西宁市", "lon": 46899219, "lat": 16873247},
            {"admin": 632100, "name": "海东市", "lon": 47186717, "lat": 16810947},
            {"admin": 632200, "name": "海北藏族自治州", "lon": 46495162, "lat": 17028652},
            {"admin": 632300, "name": "黄南藏族自治州", "lon": 47008544, "lat": 16367575},
            {"admin": 632500, "name": "海南藏族自治州", "lon": 46365793, "lat": 16720787},
            {"admin": 632600, "name": "果洛藏族自治州", "lon": 46192781, "lat": 15884426},
            {"admin": 632700, "name": "玉树藏族自治州", "lon": 44700595, "lat": 15208833},
            {"admin": 632800, "name": "海西蒙古族藏族自治州", "lon": 44868658, "lat": 17223368},
            {"admin": 640000, "name": "宁夏回族自治区", "lon": 48963912, "lat": 17727538},
            {"admin": 640100, "name": "银川市", "lon": 48951927, "lat": 17734552},
            {"admin": 640200, "name": "石嘴山市", "lon": 49021830, "lat": 17963873},
            {"admin": 640300, "name": "吴忠市", "lon": 48936402, "lat": 17509271},
            {"admin": 640400, "name": "固原市", "lon": 48956585, "lat": 16596081},
            {"admin": 640500, "name": "中卫市", "lon": 48474667, "lat": 17280120},
            {"admin": 650000, "name": "新疆维吾尔自治区", "lon": 40378568, "lat": 20180013},
            {"admin": 650100, "name": "乌鲁木齐市", "lon": 40373858, "lat": 20195311},
            {"admin": 650200, "name": "克拉玛依市", "lon": 39116976, "lat": 21003259},
            {"admin": 652100, "name": "吐鲁番地区", "lon": 41098540, "lat": 19791959},
            {"admin": 652200, "name": "哈密地区", "lon": 43092293, "lat": 19730875},
            {"admin": 652300, "name": "昌吉回族自治州", "lon": 40231628, "lat": 20280347},
            {"admin": 652700, "name": "博尔塔拉蒙古自治州", "lon": 37816312, "lat": 20692671},
            {"admin": 652800, "name": "巴音郭楞蒙古自治州", "lon": 39695694, "lat": 19244870},
            {"admin": 652900, "name": "阿克苏地区", "lon": 36983845, "lat": 18970408},
            {"admin": 653000, "name": "克孜勒苏柯尔克孜自治州", "lon": 35097574, "lat": 18300810},
            {"admin": 653100, "name": "喀什地区", "lon": 35016081, "lat": 18187970},
            {"admin": 653200, "name": "和田地区", "lon": 36828274, "lat": 17102274},
            {"admin": 654000, "name": "伊犁哈萨克自治州", "lon": 37474173, "lat": 20236903},
            {"admin": 654200, "name": "塔城地区", "lon": 38237396, "lat": 21540243},
            {"admin": 654300, "name": "阿勒泰地区", "lon": 40615018, "lat": 22047271}
        ],
        /*options = {
         *	     enableHighAccuracy,//boolean 是否要求高精度的地理信息
         *	     timeout,//获取信息的超时限制
         *	     maximumAge//对地理信息进行缓存的时间
         *}
         *onsuccess方法中会返回position对象:
         *
         *lat: position.coords.latitude,//十进制纬度
         *lng: position.coords.longitude,//十进制经度
         *heading: position.coords.heading,//指南针方向，相对于正北方向顺时针方向计算,NaN or null表示没有检测到数据
         *accuracy: position.coords.accuracy,//经、纬坐标精度（米）
         *altitude: position.coords.altitude,//海拔高度（米），如果没有数据则值为null
         *altitudeAccuracy: position.coords.altitudeAccuracy,//海拔高度的精度（米），值越大越不精确
         *speed: position.coords.speed,//速度（米/秒），如果没有数据则值为null
         *timestamp: position.timestamp //地理数据创建的时间
         */
        getPosition: function (options) {

            var onSuccess = options.cbOk || emptyFn, onError = options.cbErr || emptyFn;

            var geolocation = navigator.geolocation;
            if (geolocation) {
                geolocation.getCurrentPosition(onSuccess, function (error) {
                    onError(error);
                }, options);
            } else {
                onError({"code": 500, "message": "data null"});
            }

        },
        //GPS定位获取用户当前位置Gcj02经纬度坐标
        getPositionGcj02: function (options) {
            var fn = options.cbOk || emptyFn, error = options.cbErr || emptyFn;
            var geolocation = navigator.geolocation;
            if (geolocation) {
                try {
                    geolocation.getCurrentPosition(function (position) {
                        try {
                            var latLng = {
                                lat: position.coords.latitude,//十进制纬度
                                lon: position.coords.longitude//十进制经度
                            };
                            var gpsObj = gps84ToGcj02.gps84_To_Gcj02(latLng.lat, latLng.lon);
                            if (gpsObj != null) {
                                latLng.lat = gpsObj.wgLat;
                                latLng.lon = gpsObj.wgLon;
                            }
                            fn(latLng);
                        } catch (e) {
                        }
                    }, function (err) {
                        error(err);
                    }, {timeout: 5000});
                } catch (e) {
                    error({"code": 500, "message": "data null"});
                }
            } else {
                error({"code": 500, "message": "data null"});
            }
        },
        getGps: function (options) {
            me.getPositionGcj02(options);
        },
        //根据城市代码，获取城市信息
        getCityByCode: function (code) {
            var target = null;
            $.each(me.citys, function (n, city) {
                if (city.admin == code) {
                    target = city;
                }
            });
            return target;
        },
        //根据经纬度，获取城市代码
        getCityCodeByGeo: function (options) {

            var proxyUrl='/h5base/pub/proxy/fcommon_proxy.php?_en=1&mc=' + options.lon + ',' + options.lat;

            proxyUrl+='&uri=http://traffic.chetuobang.com/tmc/reverse/city';

            $.get(proxyUrl, function (rsl) {

                rsl = JSON.parse(rsl);

                options.cbOk(rsl.cityCode);
            });
        },
        //根据用户当前位置，获取城市信息
        getCityByGps: function (options) {
            me.getPositionGcj02({
                cbOk: function (opts) {
                    me.getCityCodeByGeo({
                        lon: opts.lon,
                        lat: opts.lat,
                        cbOk: function (cityCode) {
                            options.cbOk(me.getCityByCode(cityCode));
                        },
                        cbErr:function(msg){
                            alert(msg);
                        }
                    });
                },
                cbErr: function () {
                    if(options.cbErr){
                        options.cbErr(null);
                    }
                }
            });
        }
    };

    return me;
}