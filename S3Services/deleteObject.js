require("dotenv").config()

const { S3Client , DeleteObjectsCommand} = require("@aws-sdk/client-s3")

const s3Client = new S3Client({
    credentials:{
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        accessKeyId: process.env.AWS_ACCESS_KEY_ID
    }
});

async function deleteObjectCommand(req,res,path){
    try{
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

        const response = await s3Client.send(command);
        console.log(response);
        return response;
    }
    catch(error){
        console.error("Error deleting file: ",error);
        return error;
    }
}


module.exports = deleteObjectCommand;