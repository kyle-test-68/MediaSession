playButton = document.querySelector('#playButton');
pauseButton = document.querySelector('#pauseButton');
nextButton = document.querySelector('#nextButton');
time = document.querySelector('#time');
//text = document.querySelector('#header');

playButton.addEventListener('click', onPlayButtonClick);
pauseButton.addEventListener('click', pauseAudio);
nextButton.addEventListener('click', nextTrack);

if (!('mediaSession' in navigator)) {
    console.log('The Media Session API is not yet available. Try Chrome for Android.');
}

// This prevents unnecessary errors when Media Session API is not available.
navigator.mediaSession = navigator.mediaSession || {};
navigator.mediaSession.setActionHandler = navigator.mediaSession.setActionHandler || function () { };
window.MediaMetadata = window.MediaMetadata || function () { };

//log = ChromeSamples.log;
let audio = document.createElement('audio');

let playlist = getAwesomePlaylist();
let index = 0;

function onPlayButtonClick() {
    playAudio();
}

function getTime(time) {
    var minutes = Math.floor(time / 60);
    var seconds = time - minutes * 60;
    return str_pad_left(minutes, '0', 2) + ':' + str_pad_left(seconds, '0', 2);
}

function str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
}


function changeDetails() {
    document.getElementById("title").innerHTML = playlist[index].title;
    document.getElementById("artist").innerHTML = playlist[index].artist;
    document.getElementById("thumbnail").src = playlist[index].artwork[0].src;
    //document.getElementById("time").innerHTML = audio.duration;

}

function playAudio() {
    //document.querySelector('#header').innerHTML("▶");
    audio.src = playlist[index].src;
    audio.play()
        .then(_ => updateMetadata())
        .then(_ => changeDetails())
        .catch(error => console.log(error));
    //changeDetails();
}

function pauseAudio() {
    audio.pause();
}

function updateMetadata() {
    let track = playlist[index];

    console.log('Playing ' + track.title + ' track...');
    navigator.mediaSession.metadata = new MediaMetadata({
        title: track.title,
        artist: track.artist,
        album: track.album,
        artwork: track.artwork
    });

    // Media is loaded, set the duration.
    updatePositionState();
}

/* Position state (supported since Chrome 81) */

function updatePositionState() {
    if ('setPositionState' in navigator.mediaSession) {
        console.log('Updating position state...');
        navigator.mediaSession.setPositionState({
            duration: audio.duration,
            playbackRate: audio.playbackRate,
            position: audio.currentTime
        });
    }
}

/* Previous Track & Next Track */

navigator.mediaSession.setActionHandler('previoustrack', function () {
    console.log('> User clicked "Previous Track" icon.');
    index = (index - 1 + playlist.length) % playlist.length;
    playAudio();
});

navigator.mediaSession.setActionHandler('nexttrack', function () {
    nextTrack();

});

function nextTrack() {
    console.log('> User clicked "Next Track" icon.');
    index = (index + 1) % playlist.length;
    playAudio();
}

audio.addEventListener('ended', function () {
    // Play automatically the next track when audio ends.
    index = (index - 1 + playlist.length) % playlist.length;
    playAudio();
});

/* Seek Backward & Seek Forward */

let defaultSkipTime = 10; /* Time to skip in seconds by default */

navigator.mediaSession.setActionHandler('seekbackward', function (event) {
    console.log('> User clicked "Seek Backward" icon.');
    const skipTime = event.seekOffset || defaultSkipTime;
    audio.currentTime = Math.max(audio.currentTime - skipTime, 0);
    updatePositionState();
});

navigator.mediaSession.setActionHandler('seekforward', function (event) {
    console.log('> User clicked "Seek Forward" icon.');
    const skipTime = event.seekOffset || defaultSkipTime;
    audio.currentTime = Math.min(audio.currentTime + skipTime, audio.duration);
    updatePositionState();
});

/* Play & Pause */

navigator.mediaSession.setActionHandler('play', async function () {
    console.log('> User clicked "Play" icon.');
    await audio.play();
    navigator.mediaSession.playbackState = "playing";
    // Do something more than just playing audio...
});

navigator.mediaSession.setActionHandler('pause', function () {
    console.log('> User clicked "Pause" icon.');
    audio.pause();
    navigator.mediaSession.playbackState = "paused";
    // Do something more than just pausing audio...
});

/* Stop (supported since Chrome 77) */

try {
    navigator.mediaSession.setActionHandler('stop', function () {
        console.log('> User clicked "Stop" icon.');
        // TODO: Clear UI playback...
    });
} catch (error) {
    console.log('Warning! The "stop" media session action is not supported.');
}

/* Seek To (supported since Chrome 78) */

try {
    navigator.mediaSession.setActionHandler('seekto', function (event) {
        console.log('> User clicked "Seek To" icon.');
        if (event.fastSeek && ('fastSeek' in audio)) {
            audio.fastSeek(event.seekTime);
            return;
        }
        audio.currentTime = event.seekTime;
        updatePositionState();
    });
} catch (error) {
    console.log('Warning! The "seekto" media session action is not supported.');
}

/* Utils */

function getAwesomePlaylist() {
    //const BASE_URL = 'https://storage.googleapis.com/media-session/';

    return [{
        src: '/music/symphony.mp3',
        title: 'Symphony No. 5',
        artist: 'Beethoven',
        artwork: [
            { src: '/music/beethoven-384.png', sizes: '384x384', type: 'image/png' },
            { src: '/music/beethoven-512.png', sizes: '512x512', type: 'image/png' }
        ]
    }, {
        src: '/music/valkyrie.mp3',
        title: 'Ride of the Valkyrie',
        artist: 'Wagner',
        artwork: [
            { src: '/music/wagner-384.png', sizes: '384x384', type: 'image/png' },
            { src: '/music/wagner-512.png', sizes: '512x512', type: 'image/png' }
        ]
    }];
}