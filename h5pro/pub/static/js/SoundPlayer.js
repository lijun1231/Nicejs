/**
 *
 * @type {{context: null, source: null, nowMp3: string, showSoundIconTimer: null, audioplayer: Function, loadAudioFile: Function, WWAplay: Function}}
 * 功能：封装WebAudioAPI播报音频
 * 一：SoundPlayer.loadFile(url,cal)-->播报单个语音
 * 二：SoundPlayer.WAAplay(0,playArr)-->连续播报多个语音
 * author:xiaolei.lin & xiaokun.jiang
 * 2015.12.15
 */
var soundPlayer = {
	context : null,
	source : null,
	nowMp3 : "mp3/welcome.mp3",
	showSoundIconTimer : null,
	audioplayer: function(id, file){
			var that = this;
			var audioplayer = document.getElementById(id);
			if(audioplayer != null){
				document.body.removeChild(audioplayer);
			}
			if(typeof(file) != 'undefined'){
				if(navigator.userAgent.indexOf("MSIE")>0){// IE
					var player = document.createElement('bgsound');
					player.id = id;
					player.src = file;
					player.setAttribute('autostart', 'true');
					document.body.appendChild(player);
				}else{ // Other FF Chome Safari Opera
					var player = document.createElement('audio');
					var hasAudio = !!(player.canPlayType);
					if(hasAudio){
						player.id = id;
						player.setAttribute('autoplay','autoplay');
						player.setAttribute('preload','auto');
						var mp3 = document.createElement('source');
						mp3.src = file;
						mp3.type= 'audio/mpeg';
						player.appendChild(mp3);
						document.body.appendChild(player);
						/*var ogg = document.createElement('source');
						ogg.src = file['ogg'];
						ogg.type= 'audio/ogg';
						player.appendChild(ogg); */
					}else{
						player = document.createElement("EMBED");
						player.id = id;
						player.src = file;
						player.style.width=0;
						player.style.height=0;
						player.style.border=0;
						player.setAttribute('autostart','true');
						player.setAttribute('hidden','true');
						document.body.appendChild(player);
					}
				}
			}
		},
	loadAudioFile: function(url,audioPlay_callback) {
			var that = this;
			window.AudioContext = (window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext || window.oAudioContext);
			if(window.AudioContext) {
				try{
					if(that.context == null){
						that.context = new window.AudioContext();
				    }
					console.log(that.context);
				    var xhr = new XMLHttpRequest();
					xhr.open('GET', url, 'true');
					xhr.responseType = 'arraybuffer'; // XMLHttpRequest 2的新东西
					//xhr.onreadystatechange = function() {
					xhr.onload = function() {
					    // 音频数据在request.response中，而不是request.requestText
						that.context.decodeAudioData(this.response, function(buffer){
							that.source = SoundPlayer.context.createBufferSource();
							that.source.buffer = buffer;
							that.source.loop = false;
							that.source.connect(that.context.destination);
				        	if(that.source.start){
								that.source.start(that.context.currentTime); // 0是当前audio context中的同步时间
				        	}else{
								that.source.noteOn();
				        	}
							that.source.onended = function(){
								if(typeof audioPlay_callback == "function"){
									audioPlay_callback();
								}
								if(that.source.stop){
									that.source.stop();
								}else{
									that.source.noteOff();
								}
					        };
					    }, function(e){ //解码出错时的回调函数
					    	that.audioplayer("audioplane", url);
				        });
					}
					xhr.send();

				}catch(e){
					//console.log("浏览器不支持WebAudio API");
					that.audioplayer("audioplane", url);
				}
			}else{
				//console.log("浏览器不支持WebAudio API");
				that.audioplayer("audioplane", url);
			}
		},
	/**
	 *
	 * @param n(从数组中哪个开始播，默认传0)
	 * @param _playArr(播报文件的路径数组)
	 * @constructor
	 */
	WAAplay:function(n,_playArr){
		var that = this;
		that.nowMp3 = _playArr[n];
		that.loadAudioFile(_playArr[n],function(){
			if(n == _playArr.length - 1 ){
				return;
			}
			that.WAAplay(n+1,_playArr);
		});
	}
};
