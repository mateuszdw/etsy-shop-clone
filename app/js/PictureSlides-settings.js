/*extern jQuery */
/*
	jQuery.PictureSlides is developed by Robert Nyman, http://www.robertnyman.com
	For more information, please see http://www.robertnyman.com/picture-slides
	Released under a MIT License
*/
jQuery.PictureSlides.set({
	// Switches to decide what features to use
	useImageText : false,
	useImageCounter : false,
	useNavigationLinks : true,
	useKeyboardShortcuts : true,
	useThumbnails : true,
	useFadingIn : true,
	useFadingOut : true,
	useFadeWhenNotSlideshow : true,
	useFadeForSlideshow : false,
	useDimBackgroundForSlideshow : true,
	loopSlideshow : true,
	usePreloading : false,
	
	// At page load
	startIndex : 0,	
	startSlideshowAtLoad : false,
	dimBackgroundAtLoad : false,
	
	// Large images to use and thumbnail settings
	images : [
		/* 
			Set paths to the large images. Only needed if not using thumbnails with links to them.
			Example:
				["images/picture1.jpg", "Text describing that picture"],
				["images/picture2.jpg", "More descriptive text"]
		*/
	],
	thumbnailActivationEvent : "click",
	
	// IDs of HTML elements to use
	mainImageId : "picture-slides-image", // Mandatory
	fadeContainerId : "picture-slides-container",
	imageTextContainerId : "picture-slides-image-text",
	previousLinkId : "previous-image",
	nextLinkId : "next-image",
	imageCounterId : "image-counter",
	startSlideShowId : "start-slideshow",
	stopSlideShowId : "stop-slideshow",
	thumbnailContainerId: "picture-slides-thumbnails",
	dimBackgroundOverlayId : "picture-slides-dim-overlay",
	elementOnTopOfDimBackgroundId : "picture-slides-frame",	
	
	// Fading settings
	fadeIncrement : 0.1, // Goes from 0 to 1, and vice versa
	fadeInterval : 30, // Milliseconds	
	timeForSlideInSlideshow : 2000 // Milliseconds
});