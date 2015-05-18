
//Modified from the p5 sound library
//http://p5js.org/reference/#/p5.SoundRecorder

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