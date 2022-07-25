/*
** TASK 외 추가한 기능
** 1. default video controls hide + CSS styling
** 2. 컨트롤러 hide/show (3초 토글) : pause 상태일 땐 show 유지
** 
*/

const videoSection = document.getElementById("videoSection");
const video = document.querySelector("video");
const videoController = document.getElementById("videoController");
const psBtn = videoController.querySelector("#playPauseBtn");
const currentTime = videoController.querySelector("#currentTime");
const totalTime = videoController.querySelector("#totalTime");
const volumeBtn = videoController.querySelector("#volume");
const volumeRange = videoController.querySelector("#volumeRange");
const fullscreen = videoController.querySelector("#fullscreen");

let controllerMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const handlePlayAndStop = () => {
	if (video.paused) {
		video.play();
		psBtn.className = "fas fa-pause";
		controllerMovementTimeout = setTimeout(hideController, 3000);
	} else {
		video.pause();
		psBtn.className = "fas fa-play";
		initController();
	}
};

const timeFormat = (time) =>
	new Date(time * 1000).toISOString().substring(14, 19);

const handleVideoTotalTime = () => {
	const loadedTotalTime = Math.floor(video.duration);
	totalTime.innerText = timeFormat(loadedTotalTime);
	timeLine.max = loadedTotalTime;
	videoController.classList.add("show");
}

const habndleTimeupdate = () => {
	const loadedcurrentTime = Math.floor(video.currentTime);
	currentTime.innerText = timeFormat(loadedcurrentTime);
	timeLine.value = loadedcurrentTime;
}

const handleSound = () => {
	if (video.muted) {
		video.muted = false;
		volumeRange.value = volumeValue;
		volumeBtn.className = "fas fa-volume-up";
	} else {
		video.muted = true;
		volumeRange.value = 0;
		volumeBtn.className = "fas fa-volume-mute";
	}
};

const handleVolume = (event) => {
	const {
		target: { value }
	} = event;
	if (video.muted) {
		video.muted = false;
		volumeBtn.className = "fas fa-volume-mute";
	}
	if (value === "0") {
		volumeBtn.className = "fas fa-volume-off";
	} else {
		volumeBtn.className = "fas fa-volume-up";
	}
	video.volume = volumeValue = value;
};

const handleTimeLine = (event) => {
	const {
		target: { value }
	} = event;
	video.currentTime = value;
}

const handleFullscreen = () => {
	if(!document.fullscreenElement){
		videoSection.requestFullscreen();
		videoSection.classList.add("full");
		fullscreen.className = "fas fa-solid fa-compress";
	}else{
		document.exitFullscreen();
		videoSection.classList.remove("full");
		fullscreen.className = "fas fa-solid fa-expand";
	}
}

const handleKeyEvent = (event) => {
  const { code } = event;
	switch(code){
		case "Space":
			handlePlayAndStop();
			break;
		case "KeyF":
			handleFullscreen();
			break;
		case "KeyM":
			handleSound();
			break;
	}
}

const initController = () => {
	if(controllerMovementTimeout){
		clearTimeout(controllerMovementTimeout);
		controllerMovementTimeout = null;
	}
	videoController.classList.add("show");
}

const hideController = () => videoController.classList.remove("show");

const handleMouseMove = () => {
	if(!video.paused){
		if(controllerMovementTimeout) initController();
		controllerMovementTimeout = setTimeout(hideController, 3000);
	}
}
const handleMouseLeave = () => {
	if(!video.paused)
		controllerMovementTimeout = setTimeout(hideController, 3000);
}

video.readyState > 0
	? handleVideoTotalTime()
	: video.addEventListener("loadedmetadata", handleVideoTotalTime);

video.addEventListener("timeupdate", habndleTimeupdate);
video.addEventListener("click", handlePlayAndStop);
psBtn.addEventListener("click", handlePlayAndStop);
volumeBtn.addEventListener("click", handleSound);
volumeRange.addEventListener("input", handleVolume);
timeLine.addEventListener("input", handleTimeLine);
fullscreen.addEventListener("click", handleFullscreen);

videoSection.addEventListener("mousemove", handleMouseMove);
videoSection.addEventListener("mouseleave", handleMouseLeave);
window.addEventListener("keydown", handleKeyEvent);