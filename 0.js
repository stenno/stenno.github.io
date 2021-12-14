/******/ (() => { // webpackBootstrap
var __webpack_exports__ = {};
/*!*********************************!*\
  !*** ./src/workers/parseTTY.js ***!
  \*********************************/
const TTYREC_HEADER_SIZE = 12; // bytes, 3 x Uint32
const parseHeader = (buffer) => {
  const [timestamp, usec, byteLength] = new Uint32Array(buffer);
  return ({ timestamp, usec, byteLength });
};

/* eslint-disable-next-line no-restricted-globals */
self.onmessage = (e) => {
  const buffer = e.data();
  const { byteLength: bufferLength } = buffer;
  let offset = 0;
  const decoder = new TextDecoder();
  while (offset < bufferLength) {
    const payloadOffset = offset + TTYREC_HEADER_SIZE;
    const { timestamp, usec, byteLength } = parseHeader(buffer.slice(offset, payloadOffset));
    const payloadBuffer = buffer.slice(payloadOffset, payloadOffset + byteLength);
    const payload = decoder.decode(new Uint8Array(payloadBuffer));
    const toMillisec = timestamp * 1e3 + Math.floor(usec / 1e3);
    const frame = {
      timestamp: toMillisec,
      payload,
    };
    self.postMessage(frame); /* eslint-disable-line no-restricted-globals */
    offset += TTYREC_HEADER_SIZE + byteLength;
  }
  self.postMessage('done'); /* eslint-disable-line no-restricted-globals */
};

/******/ })()
;
//# sourceMappingURL=0.js.map