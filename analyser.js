var context;
var sourceNode;
var audioBuffer;
var analyserNode;
var timer;

function init() {
    try {
        context = new webkitAudioContext();
    } catch (e) {
        console.error('Web Audio API is not supported in this browser');
    }

    document.getElementById('play').addEventListener('click', play, false);
    document.getElementById('stop').addEventListener('click', stop, false);
    document.getElementById('open').addEventListener('change', openFile, false);

}

// ローカルファイルを開く
function openFile(event) {  
    var reader = new FileReader();
    reader.onload = function(event) {
        decodeBuffer(event.target.result);
    };
    reader.readAsArrayBuffer(event.target.files[0]);
}

// ファイルの内容をデコードしてAudioBufferに変換する
function decodeBuffer(audioData) {
    context.decodeAudioData(audioData,
    function(decodedData) { // DecodeSuccessCallback
        audioBuffer = decodedData;
        document.getElementById('play').disabled = false;
    },
    function() { // DecodeErrorCallback
        console.error('Error opening file.');
    }); 
}

// 再生
function play() {
    // 音源
    sourceNode = context.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.loop = false;
    sourceNode.onended = function(event) {
        clearInterval(timer);
    };
    // アナライザー
    analyserNode = context.createAnalyser();
    analyserNode.smoothingTimeConstant = 0.1;
    analyserNode.fftSize = 512;
    // ノードを接続
    sourceNode.connect(context.destination);
    sourceNode.connect(analyserNode);

    // タイマーをセットして表示を更新する
    timer = setInterval(function() {
        drawWaveform();
        drawSpectrum();
    }, 50);

    document.getElementById('stop').disabled = false;

    // 再生を開始
    sourceNode.start(0);
}


// 停止
function stop() {
    clearInterval(timer);
    sourceNode.stop(0);
}

// スペクトラムの描画
function drawSpectrum() {
    var data =  new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteFrequencyData(data);

    var drawContext = document.getElementById('frequency').getContext("2d");
    drawContext.clearRect(0, 0, 768, 325);
    for (var i = 0; i < data.length; i++){
        drawContext.fillRect(i * 3, 256 - data[i], 3, 256);
    }
}

// 波形の描画
function drawWaveform() {
    var data =  new Uint8Array(analyserNode.frequencyBinCount);
    analyserNode.getByteTimeDomainData(data);

    var drawContext = document.getElementById('waveform').getContext("2d");
    drawContext.clearRect(0, 0, 768, 325);
    drawContext.beginPath();
    drawContext.moveTo(0, 256 - data[0], 3, 256);
    for (var i = 1; i < data.length; i++){
        //drawContext.fillRect(i*3, 256 - data[i], 3, 256);
        drawContext.lineTo(i * 3, 256 - data[i]);
    }
    drawContext.stroke();
}

window.addEventListener('load', init, false);

