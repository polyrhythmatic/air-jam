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
}).toMaster();

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
    //console.log(mousePos);
});

var activeInst = 'bongos';
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
            case 'cats':
                playCat(diff);
                break;
            case 'tambourine':
                playTambourine(diff);
                break;
            case 'toms':
                playSynthTom(diff);
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
        rhythmGuitar.triggerAttack(guitarCount);
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

playTambourine = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {
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

var catCount = 1;
playCat = function(diff) {
    if (diff > threshold && Date.now() - lastMove > 150) {

        if (catCount > 8) {
            catCount = 1;
        }
        cat.triggerAttack(catCount);
        catCount++;

        lastMove = Date.now();
    }
    lastVal = diff;
}



var soundRecorder;
soundRecorder = function(context) {
    'use strict';
    var ac = context;

    var SoundRecorder = function() {
        var self = this;

        this.input = ac.createGain();
        this.output = ac.createGain();
        this._silentNode = ac.createGain();
        this._silentNode.gain.value = 0;
        this._silentNode.connect(ac.destination);

        this.recording = false;
        this.bufferSize = 1024;
        this._channels = 2;
        // stereo (default)
        this._clear();
        // initialize variables
        this._jsNode = ac.createScriptProcessor(this.bufferSize, this._channels, 2);

        this._jsNode.onaudioprocess = function(event) {
            if (self.recording === false) {
                return;
            } else if (self.recording === true) {
                // if we are past the duration, then stop... else:
                if (self.sampleLimit && self.recordedSamples >= self.sampleLimit) {
                    self.stop();
                } else {
                    // get channel data
                    var left = event.inputBuffer.getChannelData(0);
                    var right = event.inputBuffer.getChannelData(1);
                    // clone the samples
                    self._leftBuffers.push(new Float32Array(left));
                    self._rightBuffers.push(new Float32Array(right));
                    self.recordedSamples += self.bufferSize;
                }
            }
        };

        this._jsNode.connect(this._silentNode);
    };

    /**
     *  Connect a specific device to the p5.SoundRecorder.
     *  If no parameter is given, p5.SoundRecorer will record
     *  all audible p5.sound from your sketch.
     *  
     *  @method  setInput
     *  @param {Object} [unit] p5.sound object or a web audio unit
     *                         that outputs sound
     */
    SoundRecorder.prototype.setInput = function(unit) {
        this.input.disconnect();
        this.input = null;
        this.input = ac.createGain();
        this.input.connect(this._jsNode);
        this.input.connect(this.output);
        if (unit) {
            unit.connect(this.input);
        }
    };

    /**
     *  Start recording. To access the recording, provide
     *  a p5.SoundFile as the first parameter. The p5.SoundRecorder
     *  will send its recording to that p5.SoundFile for playback once
     *  recording is complete. Optional parameters include duration
     *  (in seconds) of the recording, and a callback function that
     *  will be called once the complete recording has been
     *  transfered to the p5.SoundFile.
     *  
     *  @method  record
     *  @param  {p5.SoundFile}   soundFile    p5.SoundFile
     *  @param  {Number}   [duration] Time (in seconds)
     *  @param  {Function} [callback] The name of a function that will be
     *                                called once the recording completes
     */
    SoundRecorder.prototype.record = function(duration, callback) {
        this.recording = true;
        duration = duration || 10;
        this.sampleLimit = Math.round(duration * ac.sampleRate);
        if (callback) {
            this._callback = callback;
        }
    };
    /**
     *  Stop the recording. Once the recording is stopped,
     *  the results will be sent to the p5.SoundFile that
     *  was given on .record(), and if a callback function
     *  was provided on record, that function will be called.
     *  
     *  @method  stop
     */
    SoundRecorder.prototype.stop = function() {
        this.recording = false;
        this._callback();
        this._clear();
    };
    SoundRecorder.prototype._clear = function() {
        this._leftBuffers = [];
        this._rightBuffers = [];
        this.recordedSamples = 0;
        this.sampleLimit = null;
    };
    SoundRecorder.prototype._getBuffer = function() {
        var buffers = [];
        buffers.push(this._mergeBuffers(this._leftBuffers));
        buffers.push(this._mergeBuffers(this._rightBuffers));
        return buffers;
    };
    SoundRecorder.prototype._mergeBuffers = function(channelBuffer) {
        var result = new Float32Array(this.recordedSamples);
        var offset = 0;
        var lng = channelBuffer.length;
        for (var i = 0; i < lng; i++) {
            var buffer = channelBuffer[i];
            result.set(buffer, offset);
            offset += buffer.length;
        }
        return result;
    };
    SoundRecorder.prototype.dispose = function() {
        this._clear();
        this._callback = function() {};
        if (this.input) {
            this.input.disconnect();
        }
        this.input = null;
        this._jsNode = null;
    };

    return new SoundRecorder();
};