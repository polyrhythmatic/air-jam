var filter = new Tone.Filter(16000, 'lowpass', -48);

var voiceFilter = new Tone.Filter(1600, 'lowpass', -12);

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

var guitar = new Tone.Sampler({
    "1": "./samples/guitar/1.mp3",
    "2": "./samples/guitar/2.mp3",
    "3": "./samples/guitar/3.mp3"
}).chain(revOne, filter, Tone.Master);

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
}).chain(voiceFilter, Tone.Master);
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
var mic = new Tone.Microphone();
var recorder = new soundRecorder(Tone.context);
recorder.setInput(mic);

var recorderEnabled = false;

$("input[name=instrument]:radio").change(function(data) {
    activeInst = data.target.id;
    $("#content").html("<img src='./images/" + activeInst + ".svg' class='contentsvgs'>");
    if (activeInst === 'sampler' && recorderEnabled == false) {
        mic.start();
        recorderEnabled = true;
    }
})

var lastMove = 0;
var lastVal = 0;

var threshold = 15;

doppler.init(function(bandwidth) {
    var diff = 0;
    diff = bandwidth.right - bandwidth.left - 1;

    if (diff > threshold) {
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

window.mobileAndTabletcheck = function() {
    var check = false;
    (function(a) {
        if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return check;
}

window.nonChromeTest = function() {
    var check = false;
    if (!/chrom(e|ium)/.test(navigator.userAgent.toLowerCase())) {
        check = true;
    }
    return check;
}

$(document).load(function() {
    if (mobileAndTabletcheck() || nonChromeTest()) {
        $(".wrapper").html('<div class="main"><header><img src="images/airjamlogo.svg" alt="Air Jam" class="logo"></a><div class="nav"><a href="about.html">About</a></div></header><div class="content"><h1>( >﹏<。)～</h1><br><h1>Airjam only works on <u>laptops</u> with <a href="www.google.com/chrome/">Chrome</a></h1></div><!--content--></div><!--main-->');
    }
})

$("#lets-jam").click(function() {
    $("#content").html("<img src='./images/" + activeInst + ".svg' class='contentsvgs'>");
})

var instrumentArray = ['bongos', 'guitar', 'rhodes', 'sampler', 'cowbell', 'shakers', 'toms', 'piano', 'tambourine', 'cat'];
var instKey = 0;

$('html').keydown(function(e) {
    switch (e.which) {
        case 37:
            //left
            if (instKey == 0) {
                instKey = 9;
            } else {
                instKey--;
            }
            var pastInst = activeInst;
            activeInst = instrumentArray[instKey];
            $("#content").html("<img src='./images/" + activeInst + ".svg' class='contentsvgs'>");
            $("input[name=instrument][value=" + activeInst + "]:radio").prop('checked', true);
            if (activeInst === 'sampler' && recorderEnabled == false) {
                mic.start();
                recorderEnabled = true;
            }
            break;
        case 39:
            //right
            if (instKey == 9) {
                instKey = 0;
            } else {
                instKey++;
            }
            var pastInst = activeInst;
            activeInst = instrumentArray[instKey];
            $("#content").html("<img src='./images/" + activeInst + ".svg' class='contentsvgs'>");
            $("input[name=instrument][value=" + activeInst + "]:radio").prop('checked', true);
            if (activeInst === 'sampler' && recorderEnabled == false) {
                mic.start();
                recorderEnabled = true;
            }
            break;
    }
});
