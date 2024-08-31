let fieldNames = ["S. No.", "Product Name", "Input Image Urls"]


const equalsCheck = (a, b) => {
    return JSON.stringify(a) === JSON.stringify(b);
}
function validateCSV(rows) {
    if(rows.length === 0){
        return  "Empty CSV"
    }
    let currentCSVFields = Object.keys(rows[0])
    console.log(typeof rows)
    if(!equalsCheck(currentCSVFields,fieldNames)) return "Incorrect field names in CSV"
    const isValidURL = (url) => {
        const urlRegex = /^(https?:\/\/[^\s/$.?#].[^\s]*)$/i;
        return urlRegex.test(url);
    };
    const isPositiveInteger = (str) => {
        const num = Number(str);
        return Number.isInteger(num) && num > 0;
    };

    const serialNumbers = new Set();
    let validationError = "";
    rows.every((row, index) => {
        const serialNumber = row['S. No.'];
        const productName = row['Product Name'];
        const inputUrls = row['Input Image Urls'];

        let missingFields = [];
        if (!serialNumber) missingFields.push('S. No.');
        if (!productName) missingFields.push('Product Name');
        if (!inputUrls) missingFields.push('Input Image Urls');

        if (missingFields.length > 0) {
            validationError = `Row ${index + 1} is missing required fields: ${missingFields.join(', ')}`;
            return false;
        }

        if (!isPositiveInteger(serialNumber)) {
            validationError =  `Row ${index + 1} has an invalid serial number: ${serialNumber}`;
            return false;
        }
        if (serialNumbers.has(serialNumber)) {
            validationError =  `Row ${index + 1} has a duplicate serial number: ${serialNumber}`
            return false;
        }
        serialNumbers.add(serialNumber);

        if (!productName.trim()) {
            validationError =  `Row ${index + 1} has an empty product name.`
            return false;
        }
        const urls = inputUrls.split(',').map(url => url.trim());
        if (!urls.every(isValidURL)) {
            validationError =  `Row ${index + 1} has invalid URL(s) in Input Image Urls: ${inputUrls}`
            return false;
        }
        return true;
    });
    return validationError
}

module.exports = { validateCSV };