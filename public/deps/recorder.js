//modified from the p5 sound library
//thanks to Jason Sigal
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
    SoundRecorder.prototype.record = function(duration) {
        this.recording = true;
        duration = duration || 1;
        this.sampleLimit = Math.round(duration * ac.sampleRate);
    };
    SoundRecorder.prototype.stop = function() {
        this.recording = false;
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
        if (this.input) {
            this.input.disconnect();
        }
        this.input = null;
        this._jsNode = null;
    };

    return new SoundRecorder();
};