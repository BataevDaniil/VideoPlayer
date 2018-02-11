class VideoPlayer {
	private video;
	private navPanel:JQuery;
	private time:JQuery;
	private play:JQuery;
	private sliderTime:JQuery;
	private sliderVolume:JQuery;
	private sliderSpeed:JQuery;
	private engineSliderTime:Mousedragdrop;
	private engineSliderVolume:Mousedragdrop;
	private engineSliderSpeed:Mousedragdrop;
	private volume:JQuery;
	private speed:JQuery;
	private timeInvers:boolean;
	private fullScreenBtn:JQuery;
	private timerHide;
	private delayNavPanel:number;
	private mouseout:boolean;
	private volumeIcone:JQuery;
	private speedIcone:JQuery;
	private iconeTime:JQuery;

	constructor(private selector: JQuery) {
		this.video = selector.find('video');
		this.navPanel = selector.find('.nav-panel');
		this.play = this.navPanel.find('.play');
		this.time = this.navPanel.find('.time');
		this.sliderTime = this.navPanel.find('.slider-time');
		this.sliderVolume = this.navPanel.find('.slider-volume');
		this.sliderSpeed = this.navPanel.find('.slider-speed');
		this.volume = this.navPanel.find('.volume');
		this.speed = this.navPanel.find('.speed');
		this.fullScreenBtn = this.navPanel.find('.full-screen');
		this.volumeIcone = this.navPanel.find('.volume-icone');
		this.speedIcone = this.navPanel.find('.speed-icone');
		this.iconeTime = this.navPanel.find('.icone-time');

		this.timeInvers = false;
		this.cancelSelect();
		this.engineSliderTime = new Mousedragdrop(this.sliderTime);
		this.video.on('canplay', () => {
			this.engineSliderTime.setRangeHor(0, this.video.get(0).duration, 0);
		});
		this.delayNavPanel = 5000;

		this.engineSliderVolume = new Mousedragdrop(this.sliderVolume);
		this.engineSliderVolume.setRangeHor(0, 1, 1);

		this.engineSliderSpeed = new Mousedragdrop(this.sliderSpeed);
		this.engineSliderSpeed.setRangeHor(0.25, 2, 1);

		this.volumeIcone.on('click', () => {
			this.video.get(0).muted = !this.video.get(0).muted;
			if (this.video.get(0).muted) {
				this.volume.text(0);
				this.engineSliderVolume.setPosLeft(0);
			}
			else {
				this.volume.text(Math.round(this.video.get(0).volume * 100));
				this.engineSliderVolume.setPosLeft(this.video.get(0).volume);
			}
		});
		this.speedIcone.on('click', () => {
			this.speedChange(1);
			this.engineSliderSpeed.setPosLeft(1);
		});
		selector.on('click', (event) => {
			if (event.target == this.selector.get(0) || event.target == this.video.get(0)) {
				this.playPuse();
				this.play.toggleClass('active');
			}
		});
		$(document).on('keydown', this.keydownEvent);
		this.mouseout = true;
		selector.on('mousemove', this.hidePanel);
		$(document).on('mousemove', (event) => {
			let deltaX:number = event.pageX - this.selector.offset().left;
			let deltaY:number = event.pageY - this.selector.offset().top;

			if ((deltaX > this.selector.width() || deltaX < 0 || deltaY > this.selector.height() || deltaY < 0) && this.mouseout) {
				this.mouseout = false;
				clearTimeout(this.timerHide);
				this.timerHide = setTimeout(this.timeHiden, this.delayNavPanel);
			}
		});

		this.play.on('click', (event) => {
			if (event.target == this.play.get(0)) {
				this.playPuse();
				this.play.toggleClass('active');
			}
		});
		this.time.on('click', () => {
			this.timeInvers = !this.timeInvers;
		});
		selector.on('dblclick', (event) => {
			if (event.target == this.selector.get(0) || event.target == this.video.get(0))
				this.fullScreen();
		});
		this.video.on('timeupdate', () => {
			this.engineSliderTime.setPosLeft(this.video.get(0).currentTime);
			this.timeupdateEvent();
		});

		this.engineSliderTime.on(this.timeChange);
		this.engineSliderVolume.on(this.volumeChange);
		this.engineSliderSpeed.on(this.speedChange);

		this.fullScreenBtn.on('click', this.fullScreen);
	}

	private keydownEvent = (event) => {
		switch (event.keyCode) {
			case 32: {
				this.playPuse();
				event.preventDefault();
				break;
			}
			case 37: {
				let timeCurrent:number = this.video.get(0).currentTime;
				if (timeCurrent -5 < 0)
					this.video.get(0).currentTime = 0;
				else
					this.video.get(0).currentTime -= 5;
				break;
			}
			case 39: {
				let timeCurrent:number = this.video.get(0).currentTime;
				let timeDuration:number = this.video.get(0).duration;
				if (timeCurrent + 5 > timeDuration)
					this.video.get(0).currentTime = timeDuration;
				else
					this.video.get(0).currentTime += 5;
				break;
			}
			case 38: {
				let vol:number = this.video.get(0).volume;
				if (vol + 0.05 > 1)
					this.video.get(0).volume = 1;
				else
					this.video.get(0).volume += 0.05;
				this.engineSliderVolume.setPosLeft(vol);
				this.volume.text(Math.round(vol*100));
				break;
			}
			case 40: {
				let vol:number = this.video.get(0).volume;
				if (vol - 0.05 < 0)
					this.video.get(0).volume = 0;
				else
					this.video.get(0).volume -= 0.05;
				this.engineSliderVolume.setPosLeft(vol);
				this.volume.text(Math.round(vol*100));
				break;
			}
		}
	};

	private timeHiden = () => {
		this.navPanel.css('visibility','hidden');
		this.selector.css('cursor', 'none');
	};

	private hidePanel = (event) => {
		this.mouseout = true;
		this.navPanel.css('visibility','visible');
		this.selector.css('cursor', 'default');
		clearTimeout(this.timerHide);

		let deltaX:number = event.pageX - this.navPanel.offset().left;
		let deltaY:number = event.pageY - this.navPanel.offset().top;

		if (deltaX > this.navPanel.width() || deltaX < 0 || deltaY > this.navPanel.height() || deltaY < 0)
			this.timerHide = setTimeout(this.timeHiden, this.delayNavPanel);
	};

	public timeChange = (left:number) => {
		this.video.get(0).currentTime = left;
		this.timeupdateEvent();

		let timeCurrent:number = this.video.get(0).currentTime;
		let tmp:number = Math.floor(timeCurrent)%60;
		if (Math.floor(tmp/10) == 0)
			this.iconeTime.text(Math.floor(timeCurrent/60) + ':0' + tmp);
		else
			this.iconeTime.text(Math.floor(timeCurrent/60) + ':' + tmp);
	};

	public volumeChange = (left:number) => {
		this.video.get(0).volume = left;
		this.volume.text(Math.round(left*100));
	};

	public speedChange = (left:number) => {
		console.log(left);
		this.video.get(0).playbackRate = left;
		this.speed.text(left.toFixed(2));
	};

	public timeupdateEvent = () => {
		let timeCurrent: number = this.video.get(0).currentTime;
		let timeDuration: number = this.video.get(0).duration;


		if (this.timeInvers) {
			let tmp1:any = Math.floor(timeDuration - timeCurrent) % 60;
			tmp1 = (Math.floor(tmp1/10) == 0)?':0' + tmp1: ':' + tmp1;
			let tmp2:any = Math.floor(timeDuration) % 60;
			tmp2 = (Math.floor(tmp2/10) == 0)?':0' + tmp2: ':' + tmp2;
			this.time.text(Math.floor((timeDuration - timeCurrent) / 60) + tmp1 + ' / '
				+ Math.floor(timeDuration / 60) + tmp2);
		}
		else {
			let tmp1:any = Math.floor(timeCurrent)%60;
			tmp1 = (Math.floor(tmp1/10) == 0)?':0' + tmp1: ':' + tmp1;
			let tmp2:any = Math.floor(timeDuration)%60;
			tmp2 = (Math.floor(tmp2/10) == 0)?':0' + tmp2: ':' + tmp2;

			this.time.text(Math.floor(timeCurrent/60) + tmp1 + ' / '
				+ Math.floor(timeDuration/60) + tmp2);
		}
	};

	public playPuse = () => {
		if (this.video.get(0).paused)
			this.video.get(0).play();
		else
			this.video.get(0).pause();
	};

	public fullScreen = () => {
		if (!document.mozIsFullScreen && !document.webkitIsFullScreen) {
			if (this.selector.get(0).requestFullscreen)
				this.selector.get(0).requestFullscreen();
			else if (this.selector.get(0).mozRequestFullScreen)
				this.selector.get(0).mozRequestFullScreen();
			else if (this.selector.get(0).webkitRequestFullscreen)
				this.selector.get(0).webkitRequestFullscreen();
		}
		else {
			if (document.cancelFullScreen)
				document.cancelFullScreen();
			else if (document.mozCancelFullScreen)
				document.mozCancelFullScreen();
			else if (document.webkitCancelFullScreen)
				document.webkitCancelFullScreen();
		}
	};

	private cancelSelect() {
		this.selector.on('selectstart', function() {return false;});
		this.selector.on('mousedown', function() {return false;});
	}
}

$(function () {
	let videoPlayer = new VideoPlayer($('.video-player'));
});
