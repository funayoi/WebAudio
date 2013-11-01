var context;
var microphone;
var mediaStream;

function init() {
    try {
        context = new webkitAudioContext();
    } catch (e) {
        console.error('Web Audio API is not supported in this browser');
    }

    document.getElementById('start').addEventListener('click', start, false);
}

// 再生
function start() {
    navigator.webkitGetUserMedia({audio:true}, gotAudio);
    function gotAudio(stream) {
        mediaStream = stream;
        microphone = context.createMediaStreamSource(stream);
        microphone.connect(context.destination)
    }
}



window.addEventListener('load', init, false);

