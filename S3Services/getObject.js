require("dotenv").config()

const { S3Client, GetObjectCommand } = require("@aws-sdk/client-s3")

const { getSignedUrl } = require("@aws-sdk/s3-request-presigner"); // Fix the typo in the module import


const s3Client = new S3Client({
    credentials:{
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
    }
});


async function getObject(req,res,path){
    try{
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${path}`
        })
        const url = await getSignedUrl(s3Client, command, { expiresIn: 3600 });
        console.log(url);
        return url;
    }
    catch(error){
        console.error("Error getting file:", error);
    }
}

module.exports = getObject;