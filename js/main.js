var Mousedragdrop = (function () {
    function Mousedragdrop(element) {
        var _this = this;
        this.touchSlider = function (event) {
            _this.clickSlider(event.changedTouches[0]);
        };
        this.clickSlider = function (event) {
            if (event.target == _this.element.get(0)) {
                _this.grub = { left: _this.elementIcone.width() / 2, top: _this.elementIcone.height() / 2 };
                var shiftX = event.pageX - _this.element.offset().left;
                if (shiftX < _this.elementIcone.width() / 2)
                    _this.elementIcone.css('left', 0);
                else if (shiftX > _this.element.width() - _this.elementIcone.width())
                    _this.elementIcone.css('left', _this.element.width() - _this.elementIcone.width());
                else
                    _this.elementIcone.css('left', shiftX);
                var shiftY = event.pageY - _this.element.offset().top;
                if (shiftY < _this.elementIcone.height() / 2)
                    _this.elementIcone.css('top', 0);
                else if (shiftY > _this.element.height() - _this.elementIcone.height())
                    _this.elementIcone.css('top', _this.element.height() - _this.elementIcone.height());
                else
                    _this.elementIcone.css('top', shiftY);
                _this.callBack(_this.transfShiftLeft(shiftX), _this.transfShiftTop(shiftY));
                _this.press = true;
            }
        };
        this.transfShiftLeft = function (left) {
            return parseFloat((_this.rangeHor.left +
                (_this.rangeHor.right - _this.rangeHor.left) /
                    (_this.element.width() - _this.elementIcone.width()) * left).toFixed(4));
        };
        this.transfShiftTop = function (top) {
            return parseFloat((_this.rangeVert.bottom +
                (_this.rangeVert.top - _this.rangeVert.bottom) /
                    (_this.element.width() - _this.elementIcone.width()) * top).toFixed(4));
        };
        this.mousedownEvent = function (event) {
            _this.press = true;
            _this.grub = { left: event.pageX - _this.elementIcone.offset().left,
                top: event.pageY - _this.elementIcone.offset().top };
        };
        this.touchstartEvent = function (event) {
            _this.press = true;
            var eventTuouch = event.changedTouches[0];
            _this.grub = { left: eventTuouch.pageX - _this.elementIcone.offset().left,
                top: eventTuouch.pageY - _this.elementIcone.offset().top };
            event.preventDefault();
        };
        this.mouseupEvent = function () {
            _this.press = false;
        };
        this.touchendEvent = function (event) {
            _this.press = false;
            event.preventDefault();
        };
        this.mousemoveEvent = function (event) {
            if (_this.press) {
                var tmp1 = _this.shiftLeft;
                var tmp2 = _this.shiftTop;
                _this.mainAreaMovement(event);
                if (tmp1 !== _this.shiftLeft || tmp2 !== _this.shiftTop) {
                    _this.callBack(_this.transfShiftLeft(_this.shiftLeft), _this.transfShiftTop(_this.shiftTop));
                }
            }
        };
        this.touchmoveEvent = function (event) {
            event.preventDefault();
            if (_this.press) {
                var tmp1 = _this.shiftLeft;
                var tmp2 = _this.shiftTop;
                _this.mainAreaMovement(event.changedTouches[0]);
                if (tmp1 !== _this.shiftLeft || tmp2 !== _this.shiftTop)
                    _this.callBack(_this.transfShiftLeft(_this.shiftLeft), _this.transfShiftTop(_this.shiftTop));
            }
        };
        element.css('position', 'relative');
        this.elementIcone = element.children('.icone');
        this.elementIcone.css('position', 'absolute');
        this.press = false;
        this.mainAreaMovement = this.areaMovementSquare;
        this.elementIcone.on('mousedown', this.mousedownEvent);
        $(document).on('mouseup', this.mouseupEvent);
        $(document).on('mousemove', this.mousemoveEvent);
        element.on('mousedown', this.clickSlider);
        this.elementIcone.on('touchstart', this.touchstartEvent);
        this.elementIcone.on('touchend', this.touchendEvent);
        this.elementIcone.on('touchmove', this.touchmoveEvent);
        element.on('touchstart', this.touchSlider);
        this.element = element;
        this.shiftLeft = 0;
        this.shiftTop = 0;
        this.callBack = function () { };
        this.setRangeHor(0, 100, 0);
        this.setRangeVert(0, 100, 0);
    }
    Mousedragdrop.prototype.setPosLeft = function (left) {
        this.elementIcone.css('left', (this.element.width() - this.elementIcone.width()) /
            (this.rangeHor.right - this.rangeHor.left) *
            (left - this.rangeHor.left));
    };
    Mousedragdrop.prototype.setPosTop = function (top) {
        this.elementIcone.css('top', (this.element.height() - this.elementIcone.height()) /
            (this.rangeVert.top - this.rangeVert.bottom) *
            (top - this.rangeVert.bottom));
    };
    Mousedragdrop.prototype.setRangeHor = function (left, right, pos, step) {
        if (step === void 0) { step = null; }
        this.rangeHor = { left: left, right: right, step: step };
        this.setPosLeft(pos);
    };
    Mousedragdrop.prototype.setRangeVert = function (bottom, top, pos, step) {
        if (step === void 0) { step = null; }
        this.rangeVert = { bottom: bottom, top: top, step: step };
        this.setPosTop(pos);
    };
    Mousedragdrop.prototype.on = function (callBack) {
        this.callBack = callBack;
    };
    Mousedragdrop.prototype.areaMovementSquare = function (event) {
        var maxShiftTop = this.element.height() - this.elementIcone.height();
        var maxShiftLeft = this.element.width() - this.elementIcone.width();
        var shiftLeft = event.pageX - this.element.offset().left - this.grub.left;
        var shiftTop = event.pageY - this.element.offset().top - this.grub.top;
        if (shiftLeft > 0)
            if (shiftTop < maxShiftTop)
                if (shiftLeft < maxShiftLeft)
                    if (shiftTop > 0)
                        this.elementIcone.css('left', shiftLeft)
                            .css('top', shiftTop);
                    else {
                        if (0 < shiftLeft && shiftLeft < maxShiftLeft)
                            this.elementIcone.css('left', shiftLeft)
                                .css('top', 0);
                    }
                else {
                    if (0 < shiftTop && shiftTop < maxShiftTop)
                        this.elementIcone.css('left', maxShiftLeft)
                            .css('top', shiftTop);
                }
            else {
                if (0 < shiftLeft && shiftLeft < maxShiftLeft)
                    this.elementIcone.css('left', shiftLeft)
                        .css('top', maxShiftTop);
            }
        else {
            if (0 < shiftTop && shiftTop < maxShiftTop)
                this.elementIcone.css('left', 0)
                    .css('top', shiftTop);
        }
        if (shiftLeft < 0 && shiftTop < 0)
            this.elementIcone.css('left', 0)
                .css('top', 0);
        else if (shiftLeft > maxShiftLeft && shiftTop < 0)
            this.elementIcone.css('left', maxShiftLeft)
                .css('top', 0);
        else if (shiftLeft > maxShiftLeft && shiftTop > maxShiftTop)
            this.elementIcone.css('left', maxShiftLeft)
                .css('top', maxShiftTop);
        else if (shiftLeft < 0 && shiftTop > maxShiftTop)
            this.elementIcone.css('left', 0)
                .css('top', maxShiftTop);
        this.shiftLeft = parseFloat(this.elementIcone.css('left'));
        this.shiftTop = parseFloat(this.elementIcone.css('top'));
    };
    ;
    return Mousedragdrop;
}());
var VideoPlayer = (function () {
    function VideoPlayer(selector) {
        var _this = this;
        this.selector = selector;
        this.keydownEvent = function (event) {
            switch (event.keyCode) {
                case 32: {
                    _this.playPuse();
                    event.preventDefault();
                    break;
                }
                case 37: {
                    var timeCurrent = _this.video.get(0).currentTime;
                    if (timeCurrent - 5 < 0)
                        _this.video.get(0).currentTime = 0;
                    else
                        _this.video.get(0).currentTime -= 5;
                    break;
                }
                case 39: {
                    var timeCurrent = _this.video.get(0).currentTime;
                    var timeDuration = _this.video.get(0).duration;
                    if (timeCurrent + 5 > timeDuration)
                        _this.video.get(0).currentTime = timeDuration;
                    else
                        _this.video.get(0).currentTime += 5;
                    break;
                }
                case 38: {
                    var vol = _this.video.get(0).volume;
                    if (vol + 0.05 > 1)
                        _this.video.get(0).volume = 1;
                    else
                        _this.video.get(0).volume += 0.05;
                    _this.engineSliderVolume.setPosLeft(vol);
                    _this.volume.text(Math.round(vol * 100));
                    break;
                }
                case 40: {
                    var vol = _this.video.get(0).volume;
                    if (vol - 0.05 < 0)
                        _this.video.get(0).volume = 0;
                    else
                        _this.video.get(0).volume -= 0.05;
                    _this.engineSliderVolume.setPosLeft(vol);
                    _this.volume.text(Math.round(vol * 100));
                    break;
                }
            }
        };
        this.timeHiden = function () {
            _this.navPanel.css('visibility', 'hidden');
            _this.selector.css('cursor', 'none');
        };
        this.hidePanel = function (event) {
            _this.mouseout = true;
            _this.navPanel.css('visibility', 'visible');
            _this.selector.css('cursor', 'default');
            clearTimeout(_this.timerHide);
            var deltaX = event.pageX - _this.navPanel.offset().left;
            var deltaY = event.pageY - _this.navPanel.offset().top;
            if (deltaX > _this.navPanel.width() || deltaX < 0 || deltaY > _this.navPanel.height() || deltaY < 0)
                _this.timerHide = setTimeout(_this.timeHiden, _this.delayNavPanel);
        };
        this.timeChange = function (left) {
            _this.video.get(0).currentTime = left;
            _this.timeupdateEvent();
            var timeCurrent = _this.video.get(0).currentTime;
            var tmp = Math.floor(timeCurrent) % 60;
            if (Math.floor(tmp / 10) == 0)
                _this.iconeTime.text(Math.floor(timeCurrent / 60) + ':0' + tmp);
            else
                _this.iconeTime.text(Math.floor(timeCurrent / 60) + ':' + tmp);
        };
        this.volumeChange = function (left) {
            _this.video.get(0).volume = left;
            _this.volume.text(Math.round(left * 100));
        };
        this.speedChange = function (left) {
            console.log(left);
            _this.video.get(0).playbackRate = left;
            _this.speed.text(left.toFixed(2));
        };
        this.timeupdateEvent = function () {
            var timeCurrent = _this.video.get(0).currentTime;
            var timeDuration = _this.video.get(0).duration;
            if (_this.timeInvers) {
                var tmp1 = Math.floor(timeDuration - timeCurrent) % 60;
                tmp1 = (Math.floor(tmp1 / 10) == 0) ? ':0' + tmp1 : ':' + tmp1;
                var tmp2 = Math.floor(timeDuration) % 60;
                tmp2 = (Math.floor(tmp2 / 10) == 0) ? ':0' + tmp2 : ':' + tmp2;
                _this.time.text(Math.floor((timeDuration - timeCurrent) / 60) + tmp1 + ' / '
                    + Math.floor(timeDuration / 60) + tmp2);
            }
            else {
                var tmp1 = Math.floor(timeCurrent) % 60;
                tmp1 = (Math.floor(tmp1 / 10) == 0) ? ':0' + tmp1 : ':' + tmp1;
                var tmp2 = Math.floor(timeDuration) % 60;
                tmp2 = (Math.floor(tmp2 / 10) == 0) ? ':0' + tmp2 : ':' + tmp2;
                _this.time.text(Math.floor(timeCurrent / 60) + tmp1 + ' / '
                    + Math.floor(timeDuration / 60) + tmp2);
            }
        };
        this.playPuse = function () {
            if (_this.video.get(0).paused)
                _this.video.get(0).play();
            else
                _this.video.get(0).pause();
        };
        this.fullScreen = function () {
            if (!document.mozIsFullScreen && !document.webkitIsFullScreen) {
                if (_this.selector.get(0).requestFullscreen)
                    _this.selector.get(0).requestFullscreen();
                else if (_this.selector.get(0).mozRequestFullScreen)
                    _this.selector.get(0).mozRequestFullScreen();
                else if (_this.selector.get(0).webkitRequestFullscreen)
                    _this.selector.get(0).webkitRequestFullscreen();
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
        this.video.on('canplay', function () {
            _this.engineSliderTime.setRangeHor(0, _this.video.get(0).duration, 0);
            _this.playPuse();
        });
        this.delayNavPanel = 5000;
        this.engineSliderVolume = new Mousedragdrop(this.sliderVolume);
        this.engineSliderVolume.setRangeHor(0, 1, 1);
        this.engineSliderSpeed = new Mousedragdrop(this.sliderSpeed);
        this.engineSliderSpeed.setRangeHor(0.25, 2, 1);
        this.volumeIcone.on('click', function () {
            _this.video.get(0).muted = !_this.video.get(0).muted;
            if (_this.video.get(0).muted) {
                _this.volume.text(0);
                _this.engineSliderVolume.setPosLeft(0);
            }
            else {
                _this.volume.text(Math.round(_this.video.get(0).volume * 100));
                _this.engineSliderVolume.setPosLeft(_this.video.get(0).volume);
            }
        });
        this.speedIcone.on('click', function () {
            _this.speedChange(1);
            _this.engineSliderSpeed.setPosLeft(1);
        });
        selector.on('click', function (event) {
            if (event.target == _this.selector.get(0) || event.target == _this.video.get(0)) {
                _this.playPuse();
                _this.play.toggleClass('active');
            }
        });
        $(document).on('keydown', this.keydownEvent);
        this.mouseout = true;
        selector.on('mousemove', this.hidePanel);
        $(document).on('mousemove', function (event) {
            var deltaX = event.pageX - _this.selector.offset().left;
            var deltaY = event.pageY - _this.selector.offset().top;
            if ((deltaX > _this.selector.width() || deltaX < 0 || deltaY > _this.selector.height() || deltaY < 0) && _this.mouseout) {
                _this.mouseout = false;
                clearTimeout(_this.timerHide);
                _this.timerHide = setTimeout(_this.timeHiden, _this.delayNavPanel);
            }
        });
        this.play.on('click', function (event) {
            if (event.target == _this.play.get(0)) {
                _this.playPuse();
                _this.play.toggleClass('active');
            }
        });
        this.time.on('click', function () {
            _this.timeInvers = !_this.timeInvers;
        });
        selector.on('dblclick', function (event) {
            if (event.target == _this.selector.get(0) || event.target == _this.video.get(0))
                _this.fullScreen();
        });
        this.video.on('timeupdate', function () {
            _this.engineSliderTime.setPosLeft(_this.video.get(0).currentTime);
            _this.timeupdateEvent();
        });
        this.engineSliderTime.on(this.timeChange);
        this.engineSliderVolume.on(this.volumeChange);
        this.engineSliderSpeed.on(this.speedChange);
        this.fullScreenBtn.on('click', this.fullScreen);
    }
    VideoPlayer.prototype.cancelSelect = function () {
        this.selector.on('selectstart', function () { return false; });
        this.selector.on('mousedown', function () { return false; });
    };
    return VideoPlayer;
}());
$(function () {
    var videoPlayer = new VideoPlayer($('.video-player'));
});
