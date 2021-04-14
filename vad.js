/**
 * Copyright 2021 Johannes Kropf
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
 
module.exports = function(RED) {
    
    const VAD = require("node-vad");

    function VadNode(config) {
        RED.nodes.createNode(this,config);
        
        this.rate = Number(config.rate);
        this.mode = config.mode;
        this.vadProcessor = false;
        this.inputProp = config.inputProp || "payload";
        this.outputProp = config.outputProp || "vad";
        
        var node = this;
        
        node.vadProcessor = new VAD(VAD.Mode[node.mode]);
        
        node.on('input', function(msg, send, done) {
            
            let input = RED.util.getMessageProperty(msg, node.inputProp);
            
            if (Buffer.isBuffer(input)) {
                node.vadProcessor.processAudio(input, node.rate).then(res => {
                    switch (res) {
                        case VAD.Event.ERROR:
                            (done) ? done("vad error") : node.error("vad error");
                            return;
                        case VAD.Event.NOISE:
                            RED.util.setMessageProperty(msg, node.outputProp, "noise", true);
                            (send) ? send(msg) : node.send(msg);
                            break;
                        case VAD.Event.SILENCE:
                            RED.util.setMessageProperty(msg, node.outputProp, "silence", true);
                            (send) ? send(msg) : node.send(msg);
                            break;
                        case VAD.Event.VOICE:
                            RED.util.setMessageProperty(msg, node.outputProp, "voice", true);
                            (send) ? send(msg) : node.send(msg);
                            break;
                    }
                }).catch((error) => {
                    (done) ? done(error) : node.error(done);
                    return;
                });
            }
            
            if (done) {
                done();
            }
            return;
        });
        
        node.on("close",function() {
            delete node.vadProcessor;
        });
    
    }
    
    RED.nodes.registerType("vad",VadNode);
    
}