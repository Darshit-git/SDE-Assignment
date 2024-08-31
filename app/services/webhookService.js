const axios = require('axios');

class WebhookService {
    static async sendNotification(webhookUrl, requestId, status) {
        try {
            await axios.post(webhookUrl, {
                requestId,
                status,
                completedAt: new Date().toISOString()
            });
        } catch (error) {
            console.error(`${requestId}: Failed to send webhook notification: ${error.message}`);
        }
    }
}

module.exports = WebhookService