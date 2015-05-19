var filter = new Tone.Filter(16000, 'lowpass', -48);
var voiceFilter = new Tone.Filter(1600, 'lowpass', -12);
//var comp = new Tone.Compressor(-30, 3);
var revOne = new Tone.Freeverb(0.55, 0.2);
revOne.wet.value = 0.2;

var revTwo = new Tone.Freeverb(0.4, 0.2);
revTwo.wet.value = 0.1;
var revThree = new Tone.Freeverb(0.2, 0.1);
revThree.wet.value = 0.1;

var delay = new Tone.FeedbackDelay(0.175, 0.1);
delay.wet.value = 0.15

var bongo = new Tone.Sampler({
    "bongo_hit": "./samples/bongo/hit.mp3",
    "bongo_slap": "./samples/bongo/slap.mp3",
    "bongo_heel": "./samples/bongo/heel.mp3",
    "bongo_flam": "./samples/bongo/flam.mp3"
}).toMaster();

// var snare = new Tone.Sampler({
//     "snare": "./samples/snare/snare1.mp3"
// }).toMaster();

var guitar = new Tone.Sampler({
    "1": "./samples/guitar/1.mp3",
    "2": "./samples/guitar/2.mp3",
    "3": "./samples/guitar/3.mp3"
}).chain(revOne, filter, Tone.Master);
//rhythmGuitar.volume.value = -6;

var cowbell = new Tone.Sampler({
    "hi": "./samples/cowbell/hi.mp3",
    "med-hi": "./samples/cowbell/med-hi.mp3",
    "med": "./samples/cowbell/med.mp3",
    "low": "./samples/cowbell/low.mp3"
}).chain(revThree, filter, Tone.Master);

var rhodes = new Tone.Sampler({
    "1": "./samples/rhodes/1.mp3",
    "2": "./samples/rhodes/2.mp3"
}).chain(revOne, filter, Tone.Master);

var shaker = new Tone.Sampler({
    "cabasa": "./samples/shaker/cabasa.mp3",
    "caxixi": "./samples/shaker/caxixi.mp3",
    "maracas": "./samples/shaker/maracas.mp3",
    "shaker": "./samples/shaker/shaker.mp3"
}).chain(revThree, filter, Tone.Master);

var cat = new Tone.Sampler({
    "1": "./samples/cat/meow1.mp3",
    "2": "./samples/cat/meow2.mp3",
    "3": "./samples/cat/hiss.mp3",
    "4": "./samples/cat/meow3.mp3",
    "5": "./samples/cat/meow4.mp3",
    "6": "./samples/cat/purr.mp3",
    "7": "./samples/cat/meow5.mp3",
    "8": "./samples/cat/meow6.mp3"
}).toMaster();
cat.volume.value = -12;

var tambourine = new Tone.Sampler({
    "finger": "./samples/tambourine/finger.mp3",
    "roll": "./samples/tambourine/roll.mp3",
    "shake": "./samples/tambourine/shake.mp3",
    "slap": "./samples/tambourine/slap.mp3"
}).chain(revThree, filter, Tone.Master);

var synthTom = new Tone.Sampler({
    "tom1": "./samples/synth_tom/tom1.mp3",
    "tom2": "./samples/synth_tom/tom2.mp3",
    "tom3": "./samples/synth_tom/tom3.mp3",
    "tom4": "./samples/synth_tom/tom4.mp3"

}).chain(revTwo, filter, Tone.Master);
synthTom.volume.value = -2;

var piano = new Tone.Sampler({
    "1": "./samples/piano/B2.mp3",
    "2": "./samples/piano/C3.mp3",
    "3": "./samples/piano/D3.mp3",
    "4": "./samples/piano/G3.mp3"
}).chain(revTwo, filter, Tone.Master);
piano.volume.value = -12;

var sampler = new Tone.Sampler({
    "sample": "./samples/sampler/sample.mp3",
}).chain(voiceFilter,Tone.Master);
sampler.volume.value = -12;

var mousePos = 'ul';

$(document).on("mousemove", function(event) {
    var winWidth = $(window).width();
    var winHeight = $(window).height();

    if (event.pageX > winWidth / 2 && event.pageY > winHeight / 2) {
        mousePos = 'lr';
    }
    if (event.pageX > winWidth / 2 && event.pageY < winHeight / 2) {
        mousePos = 'ur';
    }
    if (event.pageX < winWidth / 2 && event.pageY > winHeight / 2) {
        mousePos = 'll';
    }
    if (event.pageX < winWidth / 2 && event.pageY < winHeight / 2) {
        mousePos = 'ul';
    }
    //variFilter.frequency.value = (event.pageX / winWidth) * 1600;
    //variFilter.Q.value = (1 - event.pageY / winHeight) * 15;
    sampler.pitch = (0.5 - event.pageX / winWidth) * 15;
});

var activeInst = 'bongos';
var mic;
var recorder = new soundRecorder(Tone.context);

$("input[name=instrument]:radio").change(function(data) {
    activeInst = data.target.id;
    $("#content").html("<img src='./images/" + activeInst + ".svg'>");
    if (activeInst === 'sampler') {
        mic = new Tone.Microphone();
        mic.start();
        recorder.setInput(mic);
    }
})

var lastMove = 0;
var lastVal = 0;

var threshold = 15;

doppler.init(function(bandwidth) {
    var diff = 0;
    diff = bandwidth.right - bandwidth.left - 1;
    //console.log("Right = " + bandwidth.right + " & left = " + bandwidth.left);
    //var velocity = (difference - threshold) / 5;
    if (diff > threshold) {
        //console.log("difference = " + difference);
        switch (activeInst) {
            case 'bongos':
                playBongo(diff);
                break;
            case 'guitar':
                playGuitar(diff);
                break;
            case 'cowbell':
                playCowbell(diff);
                break;
            case 'shakers':
                playShaker(diff);
                break;
            case 'cat':
                playCat(diff);
                break;
            case 'tambourine':
                playTambourine(diff);
                break;
            case 'toms':
                playSynthTom(diff);
                break;
            case 'rhodes':
                playRhodes(diff);
                break;
            case 'piano':
                playPiano(diff);
                break;
            case 'sampler':
                playSampler(diff);
                break;
        }
    }
});

playBongo = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {
        switch (mousePos) {
            case 'ul':
                bongo.triggerAttack("bongo_hit", 0, 1);
                break;
            case 'ur':
                bongo.triggerAttack("bongo_slap", 0, 1);
                break;
            case 'll':
                bongo.triggerAttack("bongo_heel", 0, 1);
                break;
            case 'lr':
                bongo.triggerAttack("bongo_flam", 0, 1);
                break;
        }

        lastMove = Date.now();
    }
    lastVal = diff;
}

var guitarCount = 1;
playGuitar = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {

        if (guitarCount > 3) {
            guitarCount = 1;
        }
        guitar.triggerAttack(guitarCount);
        guitarCount++;

        lastMove = Date.now();
    }
    lastVal = diff;
}

playSynthTom = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {
        switch (mousePos) {
            case 'ul':
                synthTom.triggerAttack("tom1", 0, 1);
                break;
            case 'ur':
                synthTom.triggerAttack("tom2", 0, 1);
                break;
            case 'll':
                synthTom.triggerAttack("tom3", 0, 1);
                break;
            case 'lr':
                synthTom.triggerAttack("tom4", 0, 1);
                break;
        }

        lastMove = Date.now();
    }
    lastVal = diff;
}
var triggerSpace = 150;

playTambourine = function(diff) {
    if (diff > threshold && Date.now() - lastMove > triggerSpace) {
        switch (mousePos) {
            case 'ul':
                tambourine.triggerAttack("finger", 0, 1);
                break;
            case 'ur':
                tambourine.triggerAttack("roll", 0, 1);
                break;
            case 'll':
                tambourine.triggerAttack("shake", 0, 1);
                break;
            case 'lr':
                tambourine.triggerAttack("slap", 0, 1);
                break;
        }

        lastMove = Date.now();
    }
    lastVal = diff;
}

playCowbell = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {
        switch (mousePos) {
            case 'ul':
                cowbell.triggerAttack("hi", 0, 1);
                break;
            case 'ur':
                cowbell.triggerAttack("med-hi", 0, 1);
                break;
            case 'll':
                cowbell.triggerAttack("med", 0, 1);
                break;
            case 'lr':
                cowbell.triggerAttack("low", 0, 1);
                break;
        }

        lastMove = Date.now();
    }
    lastVal = diff;
}

playShaker = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {
        switch (mousePos) {
            case 'ul':
                shaker.triggerAttack("cabasa", 0, 1);
                break;
            case 'ur':
                shaker.triggerAttack("caxixi", 0, 1);
                break;
            case 'll':
                shaker.triggerAttack("maracas", 0, 1);
                break;
            case 'lr':
                shaker.triggerAttack("shaker", 0, 1);
                break;
        }

        lastMove = Date.now();
    }
    lastVal = diff;
}

var triggerTimeout = 200;
var catCount = 1;
playCat = function(diff) {
    if (diff > threshold && Date.now() - lastMove > triggerTimeout) {

        if (catCount > 8) {
            catCount = 1;
        }
        cat.triggerAttack(catCount);
        catCount++;

        lastMove = Date.now();
    }
    lastVal = diff;
}

var rhodesCount = 1;
playRhodes = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {

        if (rhodesCount > 2) {
            rhodesCount = 1;
        }
        rhodes.triggerAttack(rhodesCount);
        rhodesCount++;

        lastMove = Date.now();
    }
    lastVal = diff;
}

playPiano = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {
        var randomNote = Math.floor(Math.random() * 4) + 1;
        piano.triggerAttackRelease(randomNote, 0.4);

        lastMove = Date.now();
    }
    lastVal = diff;
}

playSampler = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150 && !isRecording) {
        sampler.triggerAttack("sample");

        lastMove = Date.now();
    }
    lastVal = diff;
}

var isRecording = false;
$('html').keydown(function(e) {
    if (e.which == 82) {
        if (isRecording == false) {
            recorder.record();
        }
        isRecording = true;

    }
});
$('html').keyup(function(e) {
    if (e.which == 82 && isRecording === true) {
        isRecording = false;
        recordSample();
    }
});


recordSample = function() {
    var tempBuffer = Tone.context.createBuffer(2, recorder._getBuffer()[0].length, Tone.context.sampleRate);
    tempLeft = tempBuffer.getChannelData(0);
    tempRight = tempBuffer.getChannelData(1);
    recordedBuffer = recorder._getBuffer();
    for (var i = 0; i < tempLeft.length; i++) {
        tempLeft[i] = recordedBuffer[0][i];
        tempRight[i] = recordedBuffer[1][i];
    }
    sampler._buffers.sample._buffer = tempBuffer;
    recorder.stop();
}
