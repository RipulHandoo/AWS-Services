// This imports the ListObjectsCommand and S3Client modules from the @aws-sdk/client-s3 package.
// The @aws-sdk/client-s3 package is a Node.js module that provides a client for the Amazon Simple Storage Service (S3).
const { ListObjectsCommand, S3Client } = require("@aws-sdk/client-s3")

// This requires the dotenv module to load environment variables from a .env file.
// Environment variables are used to store sensitive information, such as API keys and passwords, in a file that is not committed to the source code.
require("dotenv").config()

// This creates a new S3Client object and specifies the secret access key and access id from the .env file.
// The secret access key and access id are used to authenticate requests to the Amazon S3 API.
const s3Client = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  }
})

// This is the function that will list the objects in an S3 bucket.
// The function takes three arguments: the request object, the response object, and the path to the directory where the files are located.
async function ListObjects(req, res, path) {

  // This tries to list the objects in the bucket.
  try {
    // Create a ListObjectsCommand object.
    const command = new ListObjectsCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Prefix: `${path}/`
    });

    // Send the command to the S3 client and await the response.
    const response = await s3Client.send(command);

    // Log the response.
    console.log(response);

    // Return the response.
    return response;
  } catch (error) {
    // Log the error.
    console.error("Error listing files:", error);
  }
}

// This exports the ListObjects function.
module.exports = ListObjects;
