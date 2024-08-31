# CSV Processing API
## Prerequisites
Make sure **docker** and **docker compose** cli is installed in your system

## API Bootup Instructions

```
cd app
docker compose up --build
```

Base Entrypoint: http://localhost:3000//api/images/ (Not found will be shown)

### Notes: 
- Please make sure that your local ports **27017** and **3000** are free as they will be used by mongoDB and app containers.
- Images will not be uploaded anywhere, an upload function is called which just sleeps for a fix time period to simulate the uploading process.

## Testing
- **PostMan Collection:** https://www.postman.com/orbital-module-technologist-86477148/workspace/csvapitesting/
- **Sample CSVs:** [validCSV](./sampleCSV/valid.csv) [invalidCSV](./sampleCSV/invalid.csv)
## Documentation
- **Technical Design Document:** [Link](./documents/technical-design-document.md)

## Endpoints

### 1. Upload CSV

Upload a CSV file containing image processing requests.

- **URL:** `http://localhost:3000/api/images/upload`
- **Method:** POST
- **Content-Type:** multipart/form-data

#### Request

| Field      | Type | Description                                                |
|------------|------|------------------------------------------------------------|
| file       | File | CSV file containing image processing requests              |
| webhookURL | Text | (Optional) Webhook URL for notifying client after completion |

#### CSV Format

The CSV file should contain the following columns:

- S. No.
- Product Name
- Input Image Urls (comma-separated)

#### Response

- **Success Response:**
    - **Code:** 200
    - **Content:** `{ "requestId": "<uuid>" }`

- **Error Response:**
    - **Code:** 400
    - **Content:** `{ "message": "<error message>" }`
    - **Possible errors:**
        - No file uploaded
        - CSV validation errors

- **Code:** 500
- **Content:** `{ "message": "Internal Server Error" }`

### 2. Get Status Update

Retrieve the status of a previously submitted image processing request.

- **URL:** `http://localhost:3000/api/images/status/:requestId`
- **Method:** GET

#### Parameters

| Parameter | Type   | Description                            |
|-----------|--------|----------------------------------------|
| requestId | String | UUID of the image processing request   |

#### Response

- **Success Response:**
    - **Code:** 200
    - **Content:**
      ```json
      {
        "requestId": "<uuid>",
        "status": "<status>",
        "csvEntries": [
          {
            "serialNumber": "<number>",
            "productName": "<string>",
            "inputUrls": ["<url1>", "<url2>", ...],
            "outputUrls":["<url1>", "<url2>", ...] 
          },
          ...
        ],
      "createdAt": "<timeStamp>",
      "webhookURL": "<URL>"
      }
      ```

- **Error Response:**
    - **Code:** 404
    - **Content:** `{ "message": "Request ID not found" }`

## Notes

- The API uses multer for handling file uploads.
- CSV files are validated before processing.
- Image processing is performed asynchronously after the CSV is uploaded.
- The status of a request can be checked using the provided requestId.
