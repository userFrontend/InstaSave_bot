const axios = require('axios');
require('dotenv').config();
const express = require('express')

const app = express()

app.use(express.json())


const downloadApi = async (insta_url) => {
  try {
    const res = await axios.request({
      url: 'https://instagram-media-downloader-api-fast-2024.p.rapidapi.com/instagram',
      params: {
        url: insta_url
      },
      headers: {
        'x-rapidapi-key': '820eda211cmshda5ce2c028a0dd9p1df49ajsn75e9824c4f24',
        'x-rapidapi-host': 'instagram-media-downloader-api-fast-2024.p.rapidapi.com'
      }
    });
    
    return res.data.result;
  } catch (error) {
    console.log(error.message);
  }
};

module.exports = {downloadApi}