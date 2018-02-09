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
	private fullScreenBtn;

	constructor(private selector: JQuery){
		this.video = selector.children('video');
		this.navPanel = selector.children('.nav-panel');
		this.play = this.navPanel.children('.play');
		this.time = this.navPanel.children('.time');
		this.sliderTime = this.navPanel.children('.slider-time');
		this.sliderVolume = this.navPanel.children('.slider-volume');
		this.sliderSpeed = this.navPanel.children('.slider-speed');
		this.volume= this.navPanel.children('.volume');
		this.speed = this.navPanel.children('.speed');
		this.fullScreenBtn = this.navPanel.children('.full-screen');

		this.timeInvers = false;
		this.cancelSelect();
		this.time.text('00:00 / 00:00');
		this.engineSliderTime = new Mousedragdrop(this.sliderTime);
		this.video.on('canplay', () => {
			this.engineSliderTime.setRangeHor(0, this.video.get(0).duration, 0);
		});

		this.engineSliderVolume = new Mousedragdrop(this.sliderVolume);
		this.engineSliderVolume.setRangeHor(0, 1, positionSlider.right);
		this.volume.text(100);

		this.engineSliderSpeed = new Mousedragdrop(this.sliderSpeed);
		this.engineSliderSpeed.setRangeHor(0.25, 2,positionSlider.center);
		this.speed.text(1);

		selector.on('click', (event) => {
			if (event.target == this.selector.get(0) || event.target == this.video.get(0))
				this.playPuse();
		});
		this.play.on('click', (event) => {
			if (event.target == this.play.get(0)) {
				this.playPuse();
				this.play.toggleClass('active')
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

	public timeChange = (left:number, top:number) => {
		this.video.get(0).currentTime = left;
		console.log(left);
	};

	public volumeChange = (left:number, top:number) => {
		this.video.get(0).volume = left;
		this.volume.text(Math.round(left*100));
	};

	public speedChange = (left:number, top:number) => {
		this.video.get(0).playbackRate = left;
		this.speed.text(left.toFixed(2));
	};

	public timeupdateEvent = () => {
		let timeCurrent:number = this.video.get(0).currentTime;
		let timeDuration:number = this.video.get(0).duration;

		if (this.timeInvers)
			this.time.text( Math.floor((timeDuration - timeCurrent)/60) + ':' + ( Math.floor(timeDuration - timeCurrent)%60 ) + ' / '
			+ Math.floor(timeDuration/60) + ':' + (Math.floor(timeDuration)%60));
		else
			this.time.text(Math.floor(timeCurrent/60) + ':' + (Math.floor(timeCurrent)%60) + ' / '
				+ Math.floor(timeDuration/60) + ':' + (Math.floor(timeDuration)%60));
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
