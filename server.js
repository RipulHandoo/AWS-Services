const router = require("./router/s3Services")

const express = require("express")
const app = express()

app.get("/",router)

app.listen(3000,()=>{
    console.log("Server is running on port 3000")
});