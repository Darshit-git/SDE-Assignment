const mongoose = require('mongoose');

const csvSchema = new mongoose.Schema({
    serialNumber: {type: String, required: true},
    productName: {type: String, required: true},
    inputUrls: [String],
    outputUrls: [String],
})

const imageRequestSchema = new mongoose.Schema({
    requestId: { type: String, required: true, unique: true },
    csvEntries: [csvSchema],
    webhookURL: {type: String, default: ""},
    status: { type: String, enum: ['pending', 'processing', 'completed'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});
module.exports = mongoose.model('ImageRequest', imageRequestSchema);
