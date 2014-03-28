/*global jQuery, $ */
/*
	jQuery.PictureSlides is developed by Robert Nyman, http://www.robertnyman.com
	For more information, please see http://www.robertnyman.com/picture-slides
	Released under a MIT License
*/
jQuery.PictureSlides = function () {
	var useMSFilter = false;
	var previousLink = null;
	var nextLink = null;
	var imageCounter = null;
	var startSlideShowLink = null;
	var stopSlideShowLink = null;
	var dimBackgroundOverlay = null;
	var elementOnTopOfDimBackground = null;
	var dimBackgroundLink = null;
	var noDimBackgroundLink = null;
	var dimmingEnabled = false;
	var fadeContainer = null;
	var mainImage = null;
	var imageTextContainer = null;
	var thumbnailContainer = null;
	var preloadImages = true;
	var imageIndex = 0;
	var slideshowIsPlaying = false;
	return {
		currentIndex : 0,
		fadingIn : true,
		fadeLevel : 0,
		fadeEndLevel : 1,
		slideTimer : null,
		fadeTimer : null,
		setImageTimer : null,
		functionAfterFade : null,
		
		set : function (settings) {
			for (var i in settings) {
				if (typeof i === "string") {
					this[i] = settings[i];
				}
			}
		},
		
		init : function () {
			$(window).load(function () {
				jQuery.PictureSlides.initSlides();
			});
			$(window).unload(function () {
				jQuery.PictureSlides.closeSession();
			});
		},
	
		initSlides : function (){
	    	if(document.getElementById){
				fadeContainer = $("#" + this.fadeContainerId)[0];
				mainImage = $("#" + this.mainImageId)[0];
				if (this.useFadeForSlideshow && (this.useFadingIn || this.useFadingOut)) {
					//fadeIncrement : 0.1, // Goes from 0 to 1, and vice versa
					//fadeInterval : 50, // Milliseconds
					var fadeTime = (1 / this.fadeIncrement) * this.fadeInterval;
					if (this.useFadingIn && this.useFadingOut) {
						fadeTime = fadeTime * 2;
					}
					this.timeForSlideInSlideshow += fadeTime;
				}
				thumbnailContainer = $("#" + this.thumbnailContainerId)[0];
				if (!this.images) {
					this.images = [];
				}
				preloadImages = this.usePreloading || true;
				if (this.useThumbnails && thumbnailContainer) {
					this.imageLinks = $(thumbnailContainer).find("a");
					for (var i=0, il=this.imageLinks.length, link, linkElm, index, imgSrc, imgRef; i<il; i++) {
						link = $(this.imageLinks[i]);
						linkElm = link[0];
						index = function () {
							return i;
						}();
						linkElm.index = index;
						link[this.thumbnailActivationEvent](function (evt) {
							jQuery.PictureSlides.nextImage(this.index);
							return false;
						});
						imgSrc = linkElm.href;
						if (preloadImages) {
							imgRef = new Image();
							imgRef.src = imgSrc;
						}
						this.images.push([imgSrc, linkElm.title]);
					}
				}
				else if (preloadImages) {
					for (var j=0, jl=this.images.length, imgCreate; j<jl; j++) {
						imgCreate = new Image();
						imgCreate.src = this.images[j][0];
					}
				}
				
				if (this.images.length > 0) {
					if (typeof this.startIndex === "undefined") {
						this.startIndex = 0;
					}
					if(this.useImageText){
						imageTextContainer = $("#" + this.imageTextContainerId)[0];
						if(!imageTextContainer){
							this.useImageText = false;
						}
					}
					if (this.useImageCounter) {
						imageCounter = $("#" + this.imageCounterId);
					}
					if (this.useNavigationLinks) {
						previousLink = $("#" + this.previousLinkId);
						previousLink.click(this.previousLinkClick);
						nextLink = $("#" + this.nextLinkId);
						nextLink.click(this.nextLinkClick);
						
						startSlideShowLink = $("#" + this.startSlideShowId);
						startSlideShowLink.click(this.startSlideShowClick);
						stopSlideShowLink = $("#" + this.stopSlideShowId);
						stopSlideShowLink.css("display", "none");
						stopSlideShowLink.click(this.stopSlideshowClick);
					}
			
					if(this.useKeyboardShortcuts){
						$(document).keydown(function (evt) {
							jQuery.PictureSlides.keyboardNavigation(evt);
						});
					}
					if (this.useDimBackgroundForSlideshow && this.dimBackgroundOverlayId) {
						dimBackgroundOverlay = $(this.dimBackgroundOverlayId)[0];
						if (!dimBackgroundOverlay) {
							dimBackgroundOverlay = $('<div id="' + this.dimBackgroundOverlayId + '"></div>').appendTo(document.body);
						}
						elementOnTopOfDimBackground = $("#" + this.elementOnTopOfDimBackgroundId);
						elementOnTopOfDimBackground.css({
							position : "relative",
							"z-index" : (dimBackgroundOverlay.css("z-index") + 1)
						});	
						dimmingEnabled = true;
					}
					useMSFilter = (fadeContainer && typeof fadeContainer.style.filter !== "undefined") || false;
					if (this.startSlideshowAtLoad) {
						this.startSlideshow();
					}
					if (this.dimBackgroundAtLoad) {
						this.dimBackground();
					}
					else {
						this.setImage();
					}
				}
			}
		},
	
		previousLinkClick : function(evt){
			jQuery.PictureSlides.previousImage();
			return false;
		},
	
		nextLinkClick : function(evt){
			jQuery.PictureSlides.nextImage();
			return false;
		},
	
		startSlideShowClick : function(evt){
			jQuery.PictureSlides.startSlideshow();
			return false;
		},
	
		stopSlideshowClick : function(evt){
			jQuery.PictureSlides.stopSlideshow();
			return false;
		},
	
		setImage : function (index){
			index = index || this.startIndex;
			if (this.imageLinks) {
				$(this.imageLinks[imageIndex || 0]).removeClass("selected");
				$(this.imageLinks[index]).addClass("selected");
			}
			mainImage.setAttribute("src", this.images[index][0]);
			if (this.useImageText) {
				$(imageTextContainer).html(this.images[index][1]);
			}
			if(this.useImageCounter){
				$(imageCounter).html((((this.images.length > 0)? index : -1) + 1) + " / " + this.images.length);
			}
			if (this.useNavigationLinks) {
				if (index > 0) {
					previousLink.removeClass("disabled");
				}
				else {
					previousLink.addClass("disabled");
				}
				if (index < (this.images.length - 1)) {
					nextLink.removeClass("disabled");
				}
				else {
					nextLink.addClass("disabled");
				}
			}
			imageIndex = index;
		},
	
		nextImage : function (index){
			if(imageIndex < (this.images.length - 1) || typeof index !== "undefined" || this.loopSlideshow){
				this.currentIndex = (typeof index !== "undefined")? index : (this.loopSlideshow && imageIndex === (this.images.length - 1))? 0 : (imageIndex + 1);
				if (((this.useFadeForSlideshow && slideshowIsPlaying) || (!slideshowIsPlaying && this.useFadeWhenNotSlideshow)) && (this.useFadingOut || this.useFadingIn)) {
					if(this.useFadingOut){
						this.fadeOut();
					}
					else if(this.useFadingIn){
						this.fadeIn();
					}
				}
				else {
					this.setImage(this.currentIndex);
				}
			}
		},
	
		previousImage : function (){
			if(imageIndex > 0){
				this.currentIndex = imageIndex - 1;
				if (((this.useFadeForSlideshow && slideshowIsPlaying) || (!slideshowIsPlaying && this.useFadeWhenNotSlideshow)) && (this.useFadingOut || this.useFadingIn)) {
					if(this.useFadingOut){
						this.fadeOut();
					}
					else if(this.useFadingIn){
						this.fadeIn();
					}
				}
				else {
					this.setImage(this.currentIndex);
				}
			}         
		},
	
		setDimBackgroundSize : function(){
			var width = document.body.offsetWidth;
			var bodyHeight = document.body.scrollHeight;
			var height = (typeof window.innerHeight !== "undefined")? window.innerHeight : (document.documentElement)? document.documentElement.clientHeight : document.body.clientHeight;
			height = (bodyHeight > height)? bodyHeight : height;
	        dimBackgroundOverlay.css({
				width : width + "px",
				height : height + "px"
			});
		},
	
		dimBackground : function (){
			this.setDimBackgroundSize();
			dimBackgroundOverlay.css("display", "block");
		},
	
		noDimBackground : function (fromStopSlideshow){
			dimBackgroundOverlay.css("display", "none");
		},
		
		startSlideshow : function (){
			if (this.useNavigationLinks) {
				startSlideShowLink.css("display", "none");
				stopSlideShowLink.css("display", "inline");
			}
			slideshowIsPlaying = true;
			this.slideTimer = setInterval(function (obj) {
				return function () {
					obj.nextImage();
				};
			}(this), this.timeForSlideInSlideshow);
			if(dimmingEnabled  && this.useDimBackgroundForSlideshow){
				this.dimBackground();
			}
		},
	
		stopSlideshow : function (){
			clearInterval(this.slideTimer);
			clearInterval(this.fadeTimer);
			clearTimeout(this.setImageTimer);
			if (this.useNavigationLinks) {
				startSlideShowLink.css("display", "inline");
				stopSlideShowLink.css("display", "none");
			}	
			slideshowIsPlaying = false;
			if (this.useFadeForSlideshow && (this.useFadingOut || this.useFadingIn)) {
				this.setFadeParams(true, 1, 0);
				this.setFade();
			}
			if(dimmingEnabled){
				this.noDimBackground();
			}
		},
	
		fadeIn : function (){
			this.setFadeParams(true, 0, 1);
			this.functionAfterFade = null;
			this.fadeTimer = setInterval(function (obj) {
				return function () {
					obj.fade();
				};
			}(this), this.fadeInterval);
			this.setImage(this.currentIndex);
		},
	
		fadeOut : function (){
			this.setFadeParams(false, 1, 0);
			this.functionAfterFade = this.fadeOutDone;
			this.fadeTimer = setInterval(function (obj) {
				return function () {
					obj.fade();
				};
			}(this), this.fadeInterval);
		},
	
		fadeOutDone : function (){
			if(!this.useFadingIn){
				this.fadeLevel = 1;
				this.setFade();
				this.setImage(this.currentIndex);
			}
			else {
				this.fadeIn();
			}
		},
	
		fade : function (){
			if((this.fadingIn && this.fadeLevel < this.fadeEndLevel) || !this.fadingIn && this.fadeLevel > this.fadeEndLevel){
				this.fadeLevel = (this.fadingIn)? this.fadeLevel + this.fadeIncrement : this.fadeLevel - this.fadeIncrement;
				// This line is b/c of a floating point bug in JavaScript
				this.fadeLevel = Math.round(this.fadeLevel * 10) / 10;
				this.setFade();
			}
			else{
				clearInterval(this.fadeTimer);
				clearTimeout(this.setImageTimer);
				if(this.functionAfterFade){
					this.functionAfterFade();
				}
			}
		},
	
		setFade : function (){
			if(useMSFilter){
				fadeContainer.style.filter = "progid:DXImageTransform.Microsoft.Alpha(opacity=" + (this.fadeLevel * 100) + ")";
			}
			else{
				fadeContainer.style.opacity = this.fadeLevel;
			}
		},
	
		setFadeParams : function (fadingIn, fadeLevel, fadeEndLevel){
			this.fadingIn = fadingIn;
			this.fadeLevel = fadeLevel;
			this.fadeEndLevel = fadeEndLevel;
		},
	
		closeSession : function (evt){
			jQuery.PictureSlides = null;
		},
	
		keyboardNavigation : function (evt){
	    	var keyCode = evt.keyCode;
	    	if(!evt.altKey && !evt.metaKey && this.images.length > 0){
				switch(keyCode){
					case 32:
						if(slideshowIsPlaying){
							this.stopSlideshow();
						}
						else{
							this.startSlideshow();
						}
						evt.preventDefault();
						break;
					case 37:
					case 38:
						this.previousImage();
						evt.preventDefault();
						break;
					case 39:
					case 40:
						this.nextImage();
						evt.preventDefault();
						break;
				}
			}
		}
	};
}();
jQuery.PictureSlides.init();