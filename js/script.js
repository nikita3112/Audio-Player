var song = new Audio;
var isStopped = true;
var currentSong = 0;
var playlist = ["https://i111.kissvk.com/api/song/download/get/11/Mario%20Joy-Gold%20Digger-kissvk.com.mp3?origin=kissvk.com&url=sid%3A%2F%2F298552235_456239465_3e8809281177455e80_ff46226f3fd3a173fd&artist=Mario%20Joy&title=Gold%20Digger&index=1&user_id=212113762&future_urls=sid%3A%2F%2F298552235_456239464_92d8beb181e97f6cd6_c077697a07ed42b8bc%2Csid%3A%2F%2F298552235_456239463_2632c697a553f33879_40c5596f82ba43bcb8%2Csid%3A%2F%2F298552235_456239462_0d375daf02d46a4384_8424f41de33eb02cdd%2Csid%3A%2F%2F298552235_456239461_6d4e99c0a64e2636d7_45da9d4071f6e8f64d%2Csid%3A%2F%2F298552235_456239460_097c8ff2ae625f09d3_29d1eba603d0e2d3be%2Csid%3A%2F%2F298552235_456239459_244db31d1d8d69022f_c03c7b1c23dca2f535%2Csid%3A%2F%2F298552235_456239458_79a5effa1f5bd644ca_87dbd26628da245828%2Csid%3A%2F%2F298552235_456239457_0ae4fd535ee7303c05_18d85bf26325fbd371%2Csid%3A%2F%2F298552235_456239456_f4f358d77a61f951d7_d9ffb0db6b33a27e02"];
var playlistVisible = false;

function skip(to) {
	if (to == 'prev') {
		stop();
		currentSong = (--currentSong)%playlist.length;
		if (currentSong < 0) {
			currentSong += playlist.length;
		}
		playpause();
	}
	else if (to == 'next') {
		stop();
		currentSong = (++currentSong)%playlist.length;
		playpause();
	}
}

function playpause() {
	if (!song.paused) {
		song.pause();
		document.getElementById("glow").classList.add("disable-animation");
	}
	else {
	if (isStopped) {
			song.src = playlist[currentSong];
		}
		song.play();
		songFile = playlist[currentSong].split("/");
		songName = document.getElementById("songName");
		songName.innerHTML = songFile[songFile.length - 1];
		document.getElementById("glow").classList.remove("disable-animation");
		isStopped = false;
	}
}

function stop() {
	song.pause();
	document.getElementById("glow").classList.add("disable-animation");
	song.currentTime = 0;
	document.getElementById("seek").value = 0;
	isStopped = true;
	document.getElementById("songName").innerHTML = "";
}

function setPos(pos) {
	song.currentTime = pos;
}

function mute() {
	if (song.muted) {
		song.muted = false;
		document.getElementById('mute').className = "fa fa-volume-up";
		document.getElementById('mute').setAttribute('src', 'images/volume-up.svg')
	}
	else {
		song.muted = true;
		document.getElementById('mute').className = "fa fa-volume-off";
		document.getElementById('mute').setAttribute('src', 'images/no-sound.svg')
	}
}

function setVolume(volume) {
	song.volume = volume;
}

function togglePlaylist() {
	if (playlistVisible) {
		document.getElementById('playlist').className = "hide";
		document.getElementById('player').className = "";
		playlistVisible = false;
	}
	else {
		document.getElementById('player').className = "hide";
		document.getElementById('playlist').className = "";
		playlistVisible = true;
	}
}

function addList() {
	sourceUrl = document.getElementById('sourceUrl').value;
	sourceUrl.split(",").forEach((file) => {
		fileUrl = file.trim();
		if (fileUrl != "" && playlist.indexOf(fileUrl) == -1) {
			parent = document.getElementById('list');
			listItem = document.createElement('div');
			listItem.setAttribute('class','list-item');

			wrapper = document.createElement('div');
			wrapper.setAttribute('class','wrap-text');

			span = document.createElement('span');
			span.innerHTML = fileUrl;

			wrapper.appendChild(span);
			listItem.appendChild(wrapper);

			btn = document.createElement('button');
			btn.setAttribute('onclick','removeList(this)');
			btn.innerHTML = '&times;';

			listItem.appendChild(btn);
			parent.appendChild(listItem);
			playlist.push(fileUrl);
			document.getElementById('sourceUrl').value = '';
		}
	});
}

function removeList(item) {
	index = playlist.indexOf(item.parentElement.firstChild.innerText);
	if (index != -1){
		playlist.splice(index,1);
		item.parentElement.remove();
	}
}

song.addEventListener('error', function(){
	stop();
	document.getElementById("songName").innerHTML = "Error Loading Audio";
});

song.addEventListener('timeupdate', function() {
	curtime = parseInt(song.currentTime,10);
	document.getElementById('seek').max = song.duration;
	document.getElementById('seek').value = curtime;
});

song.addEventListener("ended", function() {
	song.pause();
	song.currentTime = 0;
	document.getElementById('seek').value = 0;
	if ((currentSong + 1) >= playlist.length) {
		currentSong = 0;	
	}
	else {
		currentSong++;
	}
	stop();
	song.src = playlist[currentSong];
	playpause();
});

var input = document.getElementById("sourceUrl");
input.addEventListener("keyup", function(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		addList();
	}
});