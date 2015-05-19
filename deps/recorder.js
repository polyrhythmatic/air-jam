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
    SoundRecorder.prototype.record = function(duration) {
        this.recording = true;
        duration = duration || 1;
        this.sampleLimit = Math.round(duration * ac.sampleRate);
        // if (callback) {
        //     this._callback = callback;
        // }
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
        //this._callback();
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
        //this._callback = function() {};
        if (this.input) {
            this.input.disconnect();
        }
        this.input = null;
        this._jsNode = null;
    };

    return new SoundRecorder();
};
////////////////////////////////////////////////////////////////
///
////////////////////////////////////////////////////////////////

// var audioIn;
// audioIn = function(context) {
//     'use strict';
//     var ac = context;

//     var AudioIn = function() {
//         // set up audio input
//         this.input = ac.createGain();
//         this.output = ac.createGain();
//         this.stream = null;
//         this.mediaStream = null;
//         this.currentSource = 0;
//         /**
//          *  Client must allow browser to access their microphone / audioin source.
//          *  Default: false. Will become true when the client enables acces.
//          *
//          *  @property {Boolean} enabled
//          */
//         this.enabled = false;
//         // Some browsers let developer determine their input sources
//         if (typeof window.MediaStreamTrack === 'undefined') {
//             window.alert('This browser does not support MediaStreamTrack');
//         } else if (typeof window.MediaStreamTrack.getSources !== 'undefined') {
//             // Chrome supports getSources to list inputs. Dev picks default
//             window.MediaStreamTrack.getSources(this._gotSources);
//         } else {}
//         // add to soundArray so we can dispose on close
//     };
//     /**
//      *  Start processing audio input. This enables the use of other
//      *  AudioIn methods like getLevel(). Note that by default, AudioIn
//      *  is not connected to p5.sound's output. So you won't hear
//      *  anything unless you use the connect() method.<br/>
//      *
//      *  @method start
//      */
//     AudioIn.prototype.start = function() {
//         var self = this;
//         // if _gotSources() i.e. developers determine which source to use
//         // if (p5sound.inputSources[self.currentSource]) {
//     //     // set the audio source
//     //     var audioSource = p5sound.inputSources[self.currentSource].id;
//     //     var constraints = {
//     //         audio: {
//     //             optional: [{
//     //                 sourceId: audioSource
//     //             }]
//     //         }
//     //     };
//     //     navigator.getUserMedia(constraints, this._onStream = function(stream) {
//     //         self.stream = stream;
//     //         self.enabled = true;
//     //         // Wrap a MediaStreamSourceNode around the live input
//     //         self.mediaStream = p5sound.audiocontext.createMediaStreamSource(stream);
//     //         self.mediaStream.connect(self.output);
//     //         // only send to the Amplitude reader, so we can see it but not hear it.
//     //         self.amplitude.setInput(self.output);
//     //     }, this._onStreamError = function(stream) {
//     //         console.error(stream);
//     //     });
//     // }
// // else {
//             // if Firefox where users select their source via browser
//             // if (typeof MediaStreamTrack.getSources === 'undefined') {
//             // Only get the audio stream.
//             window.navigator.getUserMedia({
//                 'audio': true
//             }, this._onStream = function(stream) {
//                 self.stream = stream;
//                 self.enabled = true;
//                 // Wrap a MediaStreamSourceNode around the live input
//                 self.mediaStream = ac.createMediaStreamSource(stream);
//                 self.mediaStream.connect(self.output);
//                 // only send to the Amplitude reader, so we can see it but not hear it.
//                 self.amplitude.setInput(self.output);
//             }, this._onStreamError = function(stream) {
//                 console.error(stream);
//             });
//         // }
//     };
//     /**
//      *  Turn the AudioIn off. If the AudioIn is stopped, it cannot getLevel().<br/>
//      *
//      *  @method stop
//      */
//     AudioIn.prototype.stop = function() {
//         if (this.stream) {
//             this.stream.stop();
//         }
//     };
//     *
//      *  Connect to an audio unit. If no parameter is provided, will
//      *  connect to the master output (i.e. your speakers).<br/>
//      *  
//      *  @method  connect
//      *  @param  {Object} [unit] An object that accepts audio input,
//      *                          such as an FFT

//     AudioIn.prototype.connect = function(unit) {
//         if (unit) {
//             if (unit.hasOwnProperty('input')) {
//                 this.output.connect(unit.input);
//             } else if (unit.hasOwnProperty('analyser')) {
//                 this.output.connect(unit.analyser);
//             } else {
//                 this.output.connect(unit);
//             }
//         } else {
//             //this.output.connect(p5sound.input);
//         }
//     };
//     /**
//      *  Disconnect the AudioIn from all audio units. For example, if
//      *  connect() had been called, disconnect() will stop sending 
//      *  signal to your speakers.<br/>
//      *
//      *  @method  disconnect
//      */
//     AudioIn.prototype.disconnect = function(unit) {
//         this.output.disconnect(unit);
//         // stay connected to amplitude even if not outputting to p5
//         this.output.connect(this.amplitude.input);
//     };
//     /**
//      *  Set amplitude (volume) of a mic input between 0 and 1.0. <br/>
//      *
//      *  @method  amp
//      *  @param  {Number} vol between 0 and 1.0
//      *  @param {Number} [time] ramp time (optional)
//      */
//     AudioIn.prototype.amp = function(vol, t) {
//         if (t) {
//             var rampTime = t || 0;
//             var currentVol = this.output.gain.value;
//             this.output.gain.cancelScheduledValues(ac.currentTime);
//             this.output.gain.setValueAtTime(currentVol, ac.currentTime);
//             this.output.gain.linearRampToValueAtTime(vol, rampTime + ac.currentTime);
//         } else {
//             this.output.gain.cancelScheduledValues(ac.currentTime);
//             this.output.gain.setValueAtTime(vol, ac.currentTime);
//         }
//     };
//     /**
//      *  Returns a list of available input sources. Some browsers
//      *  give the client the option to set their own media source.
//      *  Others allow JavaScript to determine which source,
//      *  and for this we have listSources() and setSource().<br/>
//      *
//      *  @method  listSources
//      *  @return {Array}
//      */
//     // AudioIn.prototype.listSources = function() {
//     //     console.log('input sources: ');
//     //     console.log(p5sound.inputSources);
//     //     if (p5sound.inputSources.length > 0) {
//     //         return p5sound.inputSources;
//     //     } else {
//     //         return 'This browser does not support MediaStreamTrack.getSources()';
//     //     }
//     // };
//     /**
//      *  Set the input source. Accepts a number representing a
//      *  position in the array returned by listSources().
//      *  This is only available in browsers that support 
//      *  MediaStreamTrack.getSources(). Instead, some browsers
//      *  give users the option to set their own media source.<br/>
//      *  
//      *  @method setSource
//      *  @param {number} num position of input source in the array
//      */
//     AudioIn.prototype.setSource = function(num) {
//         // TO DO - set input by string or # (array position)
//         var self = this;
//         if (p5sound.inputSources.length > 0 && num < p5sound.inputSources.length) {
//             // set the current source
//             self.currentSource = num;
//             console.log('set source to ' + p5sound.inputSources[self.currentSource].id);
//         } else {
//             console.log('unable to set input source');
//         }
//     };
//     // private method
//     AudioIn.prototype.dispose = function() {
//         this.stop();
//         if (this.output) {
//             this.output.disconnect();
//         }
//         if (this.amplitude) {
//             this.amplitude.disconnect();
//         }
//         this.amplitude = null;
//         this.output = null;
//     };
//     return new AudioIn();
// };
