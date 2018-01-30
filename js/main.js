var video = document.getElementById("vid"),
	slider = document.getElementById("slider"),
	sliderVolume = document.getElementById("slider-volume"),
	sliderRate = document.getElementById("slider-rate"),
	volume = document.getElementById("volume"),
	road = document.getElementById("road"),
	videoRate = document.getElementById("video-rate"),
	contVideo = document.getElementById("for-fullscreen"),
	toolBar = document.getElementById("tool-bar"),
	timeYn = true;
	defaultMaxVideoRate = 2;

contVideo.onselectstart= function() {return false;};
contVideo.onmousedown = function() {return false;};

var timeVisTool;
video.onmousemove = function()
{
	toolBar.style.visibility = "visible";
	clearTimeout(timeVisTool);
	timeVisTool = setTimeout(function()
	{
		toolBar.style.visibility = "hidden";
	}, 10000);
};

video.oncanplay = function()
{
};

window.onresize = function()
{
};

document.addEventListener("DOMContentLoaded", function()
{
	var temp = 1 / (defaultMaxVideoRate / (videoRate.getBoundingClientRect().width - sliderRate.getBoundingClientRect().width));
	sliderRate.style.left = temp + "px";
});

document.onwebkitfullscreenchange = function()
{
	if (document.mozIsFullScreen || document.webkitIsFullScreen)
	{
		toolBar.style.position = "absolute";
		toolBar.style.bottom = 0 + "px";
		console.log("Fullscreen");
	}
	else
	{
		toolBar.style.position = "";
		toolBar.style.bottom = "";
		console.log("NoFullscreen");
	}
};

video.onclick = playPause;

contVideo.ondblclick = function()
{
	if (!document.mozIsFullScreen && !document.webkitIsFullScreen)
	{
		if (this.requestFullscreen)
			this.requestFullscreen();
		else if (this.mozRequestFullScreen)
			this.mozRequestFullScreen();
		else if (this.webkitRequestFullscreen)
			this.webkitRequestFullscreen();
	}
	else
	{
		if (document.cancelFullScreen)
			document.cancelFullScreen();
		else if (document.mozCancelFullScreen)
			document.mozCancelFullScreen();
		else if (document.webkitCancelFullScreen)
			document.webkitCancelFullScreen();
	}
};

document.getElementById("play").onclick = playPause;

video.addEventListener("timeupdate", function()
{
	slider.style.left = (video.currentTime / (video.duration / (road.getBoundingClientRect().width - slider.getBoundingClientRect().width))) + "px";

	if (timeYn)
		document.getElementById("time").innerHTML = Math.floor(video.currentTime/60) + ":" + (Math.floor(video.currentTime)%60) + " / "
		                                            + Math.floor(video.duration/60) + ":" + (Math.floor(video.duration)%60);
	else
		document.getElementById("time").innerHTML = ( Math.floor((video.duration - video.currentTime) /60) ) + ":" + ( Math.floor(video.duration - video.currentTime)%60 ) + " / "
		                                            + Math.floor(video.duration/60) + ":" + (Math.floor(video.duration)%60);
})

document.getElementById("time").onclick = function()
{
	timeYn = timeYn?false:true;
	if (timeYn)
		document.getElementById("time").innerHTML = Math.floor(video.currentTime/60) + ":" + (Math.floor(video.currentTime)%60) + " / "
		                                            + Math.floor(video.duration/60) + ":" + (Math.floor(video.duration)%60);
	else
		document.getElementById("time").innerHTML = ( Math.floor((video.duration - video.currentTime) /60) ) + ":" + ( Math.floor(video.duration - video.currentTime)%60 ) + " / "
		                                            + Math.floor(video.duration/60) + ":" + (Math.floor(video.duration)%60);
};

video.onvolumechange = function()
{
	sliderVolume.style.left = (video.volume / (1 / (volume.getBoundingClientRect().width - sliderVolume.getBoundingClientRect().width))) + "px";
	document.getElementById("volume-value").innerHTML = Math.floor(video.volume*100);
};

var roadYn = false;
var volumeYn = false;
var videoRateYn = false;
slider.onmousedown = function()
{
	roadYn = true;
};

sliderVolume.onmousedown = function()
{
	volumeYn = true;
};

sliderRate.onmousedown = function()
{
	videoRateYn = true;
};

window.onmouseup = function()
{
	roadYn = false;
	volumeYn = false;
	videoRateYn = false;
};

window.onmousemove = function()
{
	if (roadYn)
	{
		var road = document.getElementById("road").getBoundingClientRect();
		var temp = event.clientX - road.left - slider.getBoundingClientRect().width/2;
		if ( (0 < temp) && (temp < road.width - slider.getBoundingClientRect().width ))
		{
			slider.style.left = temp + "px";
			var raz = slider.getBoundingClientRect().left - road.left;
			video.currentTime = raz / ((road.width - slider.getBoundingClientRect().width) / video.duration);
		}
		else if (temp <= 0)
			video.currentTime = 0;
		else if (temp >= (road.width - slider.getBoundingClientRect().width))
			video.currentTime = video.duration;
	}

	if (volumeYn)
	{
		var volume = document.getElementById("volume").getBoundingClientRect();
		var temp = event.clientX - volume.left - sliderVolume.getBoundingClientRect().width/2;
		if ( (0 < temp) && (temp < volume.width - sliderVolume.getBoundingClientRect().width))
		{
			sliderVolume.style.left = temp + "px";
			var raz = sliderVolume.getBoundingClientRect().left - volume.left;
			video.volume = raz / (volume.width - sliderVolume.getBoundingClientRect().width);
		}
		else if (temp <= 0)
			video.volume = 0;
		else if (temp >= volume.width - sliderVolume.getBoundingClientRect().width)
			video.volume = 1;
	}

	if (videoRateYn)
	{
		var videoRate = document.getElementById("video-rate").getBoundingClientRect();
		var temp = event.clientX - videoRate.left - sliderRate.getBoundingClientRect().width/2;
		if ( (0 < temp) && (temp < videoRate.width - sliderRate.getBoundingClientRect().width))
		{
			sliderRate.style.left = temp + "px";
			var raz = sliderRate.getBoundingClientRect().left - videoRate.left;
			video.playbackRate = raz / ((videoRate.width - sliderRate.getBoundingClientRect().width) / defaultMaxVideoRate);
		}
		else if (temp <= 0)
		{
			video.playbackRate = 0;
			sliderRate.style.left = 0 + "px";
		}
		else if (temp >= videoRate.width - sliderRate.getBoundingClientRect().width)
		{
			video.playbackRate = defaultMaxVideoRate;
			sliderRate.style.left = videoRate.width - sliderRate.getBoundingClientRect().width + "px";
		}
		document.getElementById("rate-value").innerHTML = video.playbackRate.toFixed(1);
	}
};

setInterval(function()
{
	var emptyColor = "#aaa";
	var fillColor = "#333";
	var k = (video.duration / road.getBoundingClientRect().width);
	var startBuff = video.buffered.start(0) / k;
	var endBuff = video.buffered.end(0) / k;
	var str = "background: linear-gradient( to right, "
	                                         + emptyColor + " " + startBuff + "px, "
	                                         + fillColor + " " + startBuff + "px, "
	                                         + fillColor + " " + endBuff+ "px, "
	                                         + emptyColor + " " + endBuff+ "px" + ");";
	road.style.cssText = str;
}, 1000);

function playPause()
{
	if (video.paused)
		video.play();
	else video.pause();
};