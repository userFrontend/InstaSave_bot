const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")
const http = require("http")

const app = express()

dotenv.config()

const PORT = process.env.PORT || 4001;
const server = http.createServer(app)

const startServer = async () => {
    try {
        mongoose.connect(process.env.MONGO_URL, {}).then(() => {
           server.listen(PORT, () => console.log(`Server stared on port: ${PORT}`));
        }).catch(error => console.log(error));
    } catch (error) {
        console.log(error);
    }
}


module.exports = startServer