// This requires the dotenv module to load environment variables from a .env file.
// Environment variables are used to store sensitive information, such as API keys and passwords, in a file that is not committed to the source code.
require("dotenv").config()

// This imports the S3Client and DeleteObjectsCommand modules from the @aws-sdk/client-s3 package.
// The @aws-sdk/client-s3 package is a Node.js module that provides a client for the Amazon Simple Storage Service (S3).
const { S3Client, DeleteObjectsCommand } = require("@aws-sdk/client-s3")

// This creates a new S3Client object and specifies the secret access key and access id from the .env file.
// The secret access key and access id are used to authenticate requests to the Amazon S3 API.
const s3Client = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
  }
})

// This is the function that will delete an object from an S3 bucket.
// The function takes three arguments: the request object, the response object, and the path to the file.
async function deleteObjectCommand(req, res, path) {

  // This tries to delete the object from the bucket.
  try {
    // Create a DeleteObjectsCommand object.
    const command = new DeleteObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Delete: {
        Objects: [
          {
            Key: `${path}`
          }
        ]
      }
    });

    // Send the command to the S3 client and await the response.
    const response = await s3Client.send(command);

    // Log the response.
    console.log(response);

    // Return the response.
    return response;
  } catch (error) {
    // Log the error.
    console.error("Error deleting file: ", error);

    // Return the error.
    return error;
  }
}

// This exports the deleteObjectCommand function.
module.exports = deleteObjectCommand;
