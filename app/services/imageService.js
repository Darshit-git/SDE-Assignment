const ImageRequest = require('../models/imageRequest');
const { Worker} = require('worker_threads');
const {cpus} = require("node:os");
const {join} = require("node:path");


const processImagesAsync = async (requestId, csvEntries) => {
    const numWorkers = Math.min(csvEntries.length, cpus().length);
    const chunks = chunkArray(csvEntries, numWorkers);
    const workers = [];
    const name = __dirname
    for (let i = 0; i < numWorkers; i++) {
        workers.push(new Worker(join(__dirname,"..","workerUtils","workerTask.cjs"), {
            workerData: { chunk: chunks[i], requestId }
        }));
    }

    let completedWorkers = 0;
    for (const worker of workers) {
        worker.on('message', async (message) => {
            if (message.type === 'done') {
                completedWorkers++;
                if (completedWorkers === numWorkers) {
                    await ImageRequest.findOneAndUpdate({ requestId }, { status: 'completed' });
                }
            } else if (message.type === 'update') {
                await ImageRequest.findOneAndUpdate(
                    { requestId, "csvEntries.serialNumber": message.serialNumber },
                    { $set: { "csvEntries.$.outputUrls": message.outputUrls } }
                );
            }
        });

        worker.on('error', (error) => {
            console.error(`Worker error: ${error}`);
        });

        worker.on('exit', (code) => {
            if (code !== 0) {
                console.error(`Worker stopped with exit code ${code}`);
            }
        });
    }
}

const chunkArray = (array, numChunks) => {
    const chunks = [];
    const chunkSize = Math.ceil(array.length / numChunks);
    for (let i = 0; i < array.length; i += chunkSize) {
        chunks.push(array.slice(i, i + chunkSize));
    }
    return chunks;
}


module.exports = { processImagesAsync };
