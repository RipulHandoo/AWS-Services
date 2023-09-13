require("dotenv").config()

const jwt = require("jsonwebtoken")

const { PutObjectCommand, S3Client } = require("@aws-sdk/client-s3");

const s3Client = new S3Client({
    credentials: {
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    }
});

async function createRepo(req,res){
    try{
        // Here in try block we will just take the name of the repo store it in the aws cloud as well as in the postgres database and the name of the repo will globally be unique

        // As we are storing every thing inside the user folder so we will take the user name from the jwt token

        const authToken = req.cookies.auth_token;

        const userID = jwt.verify(authToken,process.env.ACCESS_JWT_TOKEN_KEY).name;

        // get the name of the project folder from the request body

        const projectName = req.body.projectName;

        // if a folder is not created in the aws bucket with the user name then we will create the folder and also the folder with the project name the user folder will be the folder main folder where all the project will be presents and that folder will acts as a bucket for that user's project

        const command = new PutObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${userID}/${projectName}/`,
            Body: "",
            ContentType: "application/x-directory"
        });

        const response = await s3Client.send(command);
        return response;
    }
    catch(error){
        console.error("Error creating repository:", error);
    }
}

module.exports = createRepo;