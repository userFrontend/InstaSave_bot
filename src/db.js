const express = require('express')
const mongoose = require("mongoose")
const dotenv = require("dotenv")

const app = express()

dotenv.config()

const PORT = process.env.PORT || 4001;


const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URL)
        app.listen(PORT, () => console.log(`Server startedon on port: ${PORT}`))
    } catch (error) {
        console.log(error);
    }
}


module.exports = startServer