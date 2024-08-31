//fake output URL generator with appending -output to last level of URL
function convertUrl(url) {
    try {
        const urlObject = new URL(url);
        const hostnameParts = urlObject.hostname.split('.');

        if (hostnameParts.length > 1) {
            const lastPart = hostnameParts.pop();
            hostnameParts[hostnameParts.length - 1] += '-output.' + lastPart;
        } else {
            hostnameParts[0] += '-output';
        }

        urlObject.hostname = hostnameParts.join('.');
        return urlObject.toString();
    } catch (error) {
        console.error('Invalid URL:', error);
        return null;
    }
}

module.exports = {convertUrl}