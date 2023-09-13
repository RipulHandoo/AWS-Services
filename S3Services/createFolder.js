// This requires the dotenv module to load environment variables from a .env file.
// Environment variables are used to store sensitive information, such as API keys and passwords, in a file that is not committed to the source code.
require("dotenv").config()

// This imports the jwt module to verify JWT tokens.
const jwt = require("jsonwebtoken")

// This imports the PutObjectCommand and S3Client modules from the @aws-sdk/client-s3 package.
// The @aws-sdk/client-s3 package is a Node.js module that provides a client for the Amazon Simple Storage Service (S3).
const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3")

// This creates a new S3Client object and specifies the secret access key and access id from the .env file.
// The secret access key and access id are used to authenticate requests to the Amazon S3 API.
const s3Client = new S3Client({
  credentials: {
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  }
})

// This is the function that will create a new repository in AWS S3 and in the database.
// The function takes two arguments: the request object and the response object.
async function createRepo(req, res) {

  // This tries to create the repository in AWS S3.
  try {

    // Get the user ID from the JWT token.
    const authToken = req.cookies.auth_token;
    const userID = jwt.verify(authToken, process.env.ACCESS_JWT_TOKEN_KEY).name;

    // Get the name of the project from the request body.
    const projectName = req.body.projectName;

    // Create a PutObjectCommand object to create the folder for the project in AWS S3.
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: `${userID}/${projectName}/`,
      Body: "",
      ContentType: "application/x-directory"
    });

    // Send the command to the S3 client and await the response.
    const response = await s3Client.send(command);

    // Return the response.
    return response;
  } catch (error) {

    // Log the error.
    console.error("Error creating repository:", error);

    // Return an error message.
    return {
      error: error.message
    };
  }
}

// This exports the createRepo function.
module.exports = createRepo;
