// This requires the dotenv module to load environment variables from a .env file.
// Environment variables are used to store sensitive information, such as API keys and passwords, in a file that is not committed to the source code.
require("dotenv").config()

// This imports the S3Client, GetObjectCommand, and getSignedUrl modules from the @aws-sdk/client-s3 and @aws-sdk/s3-request-presigner packages.
// The @aws-sdk/client-s3 package is a Node.js module that provides a client for the Amazon Simple Storage Service (S3).
// The @aws-sdk/s3-request-presigner package is a Node.js module that provides a utility for generating pre-signed URLs for S3 requests.
const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

// This creates a new S3Client object and specifies the secret access key and access id from the .env file.
// The secret access key and access id are used to authenticate requests to the Amazon S3 API.
const s3Client = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID
  }
})

// This is the function that will get an object from an S3 bucket.
// The function takes three arguments: the request object, the response object, and the path to the file.
async function getObject(req, res, path) {

  // This tries to get the object from the bucket.
  try {
    // Create a GetObjectCommand object.
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${path}`
    })

    // Get a signed URL for the command.
    const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });

    // Log the URL.
    console.log(url);

    // Return the URL.
    return url;
  } catch (error) {
    // Log the error.
    console.error("Error getting file:", error);
  }
}

// This exports the getObject function.
module.exports = getObject;
