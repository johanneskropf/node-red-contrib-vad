# node-red-contrib-vad
An integration of the [node-vad](https://github.com/snirpo/node-vad) webrtc voice activity detection implementation for node-red.

## Installation
To install this node either search for it in the Node-RED pallete manager or install it from the Node-RED folder (in most cases `~/.node-red`)
using either:
```
npm install node-red-contrib-vad
```
to install the module from npm or use:
```
npm install johanneskropf/node-red-contrib-vad
```
to install it directly from the repository (requires **git** to be installed).

## Configuration
In the nodes configuration you have to choose the sample rate of the audio to perform the voice activity detection on ([16000 Hz is recommemded](https://github.com/snirpo/node-vad#node-vad)) and choose the level/aggressiveness of the voice activity detection ([more about this can be found here](https://github.com/snirpo/node-vad#available-vad-modes)).
You can also configure in which message property the audio will arrive and to which message property to write the result of the voice activity detection.

## Usage
Send pcm audio buffers in the confingured input property of the message to the node. The node will than return the message with the result of the voice activity detection attached as a string in the configured output property of the message. This will either be *silence* when no voice was detected or *voice* if a voice was detected.

