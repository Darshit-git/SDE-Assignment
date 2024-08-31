const {v4: uuidv4} = require("uuid");
const csv = require("csv-parser");
const {validateCSV} = require("../utils/csvValidator");
const ImageRequest = require("../models/imageRequest");
const {processImagesAsync} = require("../services/imageService");
const {createReadStream} = require("node:fs");
const asyncErrorHandler = require("../Handlers/errorHandler");
const webHookService = require("../services/webhookService");

uploadCSV = asyncErrorHandler(async (req, res, next) => {
        const results = [];
        const requestId = uuidv4();

        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        createReadStream(req.file.path)
            .pipe(csv())
            .on('data', (data) => results.push(data))
            .on('end', async () => {
                    let validationRes = validateCSV(results)
                    if (validationRes.length > 0) {
                        return res.status(400).json({ message:  validationRes});
                    }
                    let dbEntry = {
                        requestId,
                        status: "pending"
                    }
                    if(req.body["webhookURL"]){
                        dbEntry["webhookURL"] = req.body["webhookURL"];
                    }
                    dbEntry["csvEntries"] = results.map(row => ({
                        serialNumber: row["S. No."],
                        productName: row['Product Name'],
                        inputUrls: row['Input Image Urls'].split(',').map(url => url.trim()),
                    }));
                    try{
                        await ImageRequest.create(dbEntry)
                        res.json({ requestId });
                        await processImagesAsync(requestId, dbEntry.csvEntries);
                        if (dbEntry["webhookURL"]) {
                            await webHookService.sendNotification(
                                dbEntry["webhookURL"],
                                requestId,
                                'completed'
                            );
                        }
                    } catch (err) {
                        console.log(err.stack)
                        res.status(500).json({ message: "Internal Server Error" })
                    }

            })
            .on('error', (error) => {
                next(error);
            });

});

getStatusUpdate = asyncErrorHandler(async (req, res, next) => {
        const { requestId } = req.params;
        const response = await ImageRequest.findOne({ requestId });

        if (!response) {
            return res.status(404).json({ message: 'Request ID not found' });
        }

        res.json(response);
})

module.exports = {uploadCSV,getStatusUpdate};