const sharp = require('sharp');
const axios = require('axios');
const { convertUrl } = require('../utils/urlConverter');
const {parentPort, workerData} = require('worker_threads');

const processImagesWorker = async () => {
    const { chunk, requestId } = workerData;

    for (const entry of chunk) {
        let outputUrls = []
        for (const url of entry.inputUrls) {
            try {
                const response = await axios({ url, responseType: 'arraybuffer' });
                const compressedImage = await sharp(response.data).jpeg({ quality: 50 }).toBuffer();
                const outputURL = await uploadToStorage(requestId, url, compressedImage);
                outputUrls.push(outputURL);
            } catch (error) {
                console.error(`Error processing image ${url}: ${error}`);
                outputUrls.push("")
            }
        }
        parentPort.postMessage({
            type: 'update',
            serialNumber: entry.serialNumber,
            outputUrls
        });
    }
    parentPort.postMessage({ type: 'done' });
}

// File upload simulation
async function uploadToStorage(requestId, inputUrl, compressedImage) {
    return new Promise((resolve) => {
        setTimeout(() => {
            console.log(`${requestId}:File corresponding to ${inputUrl} uploaded successfully`);
            resolve(convertUrl(inputUrl));
        }, 5000);
    });
}

processImagesWorker();