var bongo = new Tone.Sampler({
    "bongo_hit": "./samples/bongo/hit.mp3",
    "bongo_slap": "./samples/bongo/slap.mp3",
    "bongo_heel": "./samples/bongo/heel.mp3",
    "bongo_flam": "./samples/bongo/flam.mp3"
}).toMaster();

// var snare = new Tone.Sampler({
//     "snare": "./samples/snare/snare1.mp3"
// }).toMaster();

var rhythmGuitar = new Tone.Sampler({
    "1": "./samples/rhythm_guitar/1.mp3",
    "2": "./samples/rhythm_guitar/2.mp3",
    "3": "./samples/rhythm_guitar/3.mp3",
    "4": "./samples/rhythm_guitar/4.mp3",
    "5": "./samples/rhythm_guitar/5.mp3",
    "6": "./samples/rhythm_guitar/6.mp3"
}).toMaster();

var cowbell = new Tone.Sampler({
    "hi": "./samples/cowbell/hi.mp3",
    "med-hi": "./samples/cowbell/med-hi.mp3",
    "med": "./samples/cowbell/med.mp3",
    "low": "./samples/cowbell/low.mp3"
}).toMaster();

var shaker = new Tone.Sampler({
    "cabasa": "./samples/shaker/cabasa.mp3",
    "caxixi": "./samples/shaker/caxixi.mp3",
    "maracas": "./samples/shaker/maracas.mp3",
    "shaker": "./samples/shaker/shaker.mp3"
}).toMaster

var cat = new Tone.Sampler({
    "hiss": "./samples/cat/hiss.mp3",
    "meow1": "./samples/cat/meow1.mp3",
    "meow2": "./samples/cat/meow2.mp3",
    "meow3": "./samples/cat/meow3.mp3",
    "meow4": "./samples/cat/meow4.mp3",
    "meow5": "./samples/cat/meow5.mp3",
    "meow6": "./samples/cat/meow6.mp3",
    "purr": "./samples/cat/purr.mp3"
}).toMaster();

var tambourine = new Tone.Sampler({
    "finger": "./samples/tambourine/finger.mp3",
    "roll": "./samples/tambourine/roll.mp3",
    "shake": "./samples/tambourine/shake.mp3",
    "slap": "./samples/tambourine/slap.mp3"
}).toMaster();

var synthTom = new Tone.Sampler({
    "tom1": "./samples/synth_tom/tom1.mp3",
    "tom2": "./samples/synth_tom/tom2.mp3",
    "tom3": "./samples/synth_tom/tom3.mp3",
    "tom4": "./samples/synth_tom/tom4.mp3"

}).toMaster();

var mousePos = 'ul';

$(document).on("mousemove", function(event) {
    // console.log("pageX: " + event.pageX + ", pageY: " + event.pageY);
    if (event.pageX > $(window).width() / 2 && event.pageY > $(window).height() / 2) {
        mousePos = 'lr';
    }
    if (event.pageX > $(window).width() / 2 && event.pageY < $(window).height() / 2) {
        mousePos = 'ur';
    }
    if (event.pageX < $(window).width() / 2 && event.pageY > $(window).height() / 2) {
        mousePos = 'll';
    }
    if (event.pageX < $(window).width() / 2 && event.pageY < $(window).height() / 2) {
        mousePos = 'ul';
    }
    console.log(mousePos);
});

var activeInst = 'bongo';
$("input[name=instrument]:radio").change(function(data) {
    activeInst = data.target.id;
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
            case 'shaker':
                playShaker(diff);
                break;
            case 'cat':
                playCat(diff);
                break;
            case 'tambourine':
                playTambourine;
                break;
            case 'tom':
                playSynthTom;
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

        if (guitarCount > 6) {
            guitarCount = 1;
        }
        rhythmGuitar.triggerAttack(guitarCount.toString());
        guitarCount++;

        lastMove = Date.now();
    }
    lastVal = diff;
}
