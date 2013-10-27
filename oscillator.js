var context;
var gainNode;
var oscillatorNode;

function init() {
    try {
        context = new webkitAudioContext();
    } catch (e) {
        console.error('Web Audio API is not supported in this browser');
    }

    // GainNode (音量の調整)
    gainNode = context.createGainNode()
    gainNode.connect(context.destination);

    document.getElementById('play').addEventListener('click', playOscillator, false);
    document.getElementById('stop').addEventListener('click', stopOscillator, false);
    document.getElementById('oscillator_type').addEventListener('change', changeOscillatorType, false);
    document.getElementById('oscillator_frequency').addEventListener('change', changeOscillatorFrequency, false);
    document.getElementById('gain_value').addEventListener('change', changeGainValue, false);
}

// 再生
function playOscillator() {
    // OscillatorNode (サイン波等の生成)
    oscillatorNode = context.createOscillator();
    // ノードを接続
    oscillatorNode.connect(gainNode);
    // 再生
    oscillatorNode.start(0);
}

// 停止
function stopOscillator() {
    oscillatorNode.stop(0);
}

// 波形の変更
function changeOscillatorType(event) {
    var newType = event.srcElement.value;
    oscillatorNode.type = newType;
}

// 周波数の変更
function changeOscillatorFrequency(event) {
    var newFrequency = event.srcElement.value;
    oscillatorNode.frequency.value = newFrequency;
    document.getElementById('oscillator_frequency_value').innerText = newFrequency;
}

// 音量の変更
function changeGainValue(event) {
    var newGainValue = event.srcElement.value;
    gainNode.gain.value = newGainValue;
}

window.addEventListener('load', init, false);

