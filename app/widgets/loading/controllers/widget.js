var loaderImage = Ti.UI.createImageView({
	width : 54,
	height : 54
});

$.loadingBox.add(loaderImage);

var loader_array_length = 10;

var loaderIndex = 1;

function loadingAnimation() {
	if (OS_ANDROID) {
		loaderImage.image = "/images/loader-sequence/frame" + loaderIndex + ".png";
	} else {
		loaderImage.image = "images/loader-sequence/frame" + loaderIndex + ".png";
	}
	loaderIndex++;
	Ti.API.info('loaderImage : ' + loaderImage.image);
	if (loaderIndex === 11)
		loaderIndex = 1;
}

var loaderAnimate = setInterval(loadingAnimation, 100);

//loaderAnimate;

exports.stopLoading = function() {
	clearInterval(loaderAnimate);
}; 