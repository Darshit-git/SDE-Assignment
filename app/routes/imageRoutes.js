const express = require('express');
const multer = require('multer');
const {uploadCSV, getStatusUpdate} = require("../controllers/imageController");

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload', upload.single('file'), uploadCSV);

router.get('/status/:requestId', getStatusUpdate);

module.exports = router;

