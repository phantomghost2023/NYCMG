const express = require('express');
const router = express.Router();
const audioStreamController = require('../controllers/audioStream.controller');

// Stream audio file with range request support
router.get('/stream/:filename', audioStreamController.streamAudio);

module.exports = router;