// This file requires the dotenv module to load environment variables from a .env file.
// Environment variables are used to store sensitive information, such as API keys and passwords, in a file that is not committed to the source code.

require("dotenv").config()

// This imports the S3Client, PutObjectCommand, and uuid modules from the @aws-sdk/client-s3 package.
// The @aws-sdk/client-s3 package is a Node.js module that provides a client for the Amazon Simple Storage Service (S3).
const { S3Client, PutObjectCommand } = require("@aws-sdk/client-s3")
const uuid = require("uuid")
const jwt = require("jsonwebtoken")

// This creates a new S3Client object and specifies the secret access key and access id from the .env file.
// The secret access key and access id are used to authenticate requests to the Amazon S3 API.
const s3Client = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  }
})

// This is the function that will upload the files to the S3 bucket.
// The function takes three arguments: the path to the directory where the files are located, an array of files, and the request and response objects.
async function PutObject(path, files, req, res) {
  try {
    // This creates an array of PutObjectCommand objects for each file.
    // The PutObjectCommand object is used to upload a file to an S3 bucket.
    const commands = files.map((file) => {
      return new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME,
        Key: `${path}/${file.originalname}`,
        Body: file.buffer,
        ContentType: file.mimetype, // Set the Content-Type header for each file
      });
    });

    // This sends all the commands to S3 concurrently and awaits their responses using Promise.all.
    // The Promise.all function waits for all of the promises to resolve before returning a single promise.
    const responses = await Promise.all(commands.map((command) => s3Client.send(command)));

    // This logs the success message for each file that was uploaded.
    responses.forEach((response, index) => {
      console.log(`File ${index + 1} uploaded successfully:`, response);
    });
    return responses;
  } catch (error) {
    // This logs the error message if there is an error uploading the files.
    console.error("Error uploading files:", error);
  }
}

// This exports the PutObject function.
module.exports = PutObject;
