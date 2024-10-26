// app.js
const express = require("express");
const fetch = require("node-fetch");
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/convert-mp3", async (req, res) => {
  try {
    let videoLink = req.body.videoLink;
    
    if (!videoLink) {
      return res.render("index", { 
        success: false, 
        message: "Please enter a video link" 
      });
    }

    // Convert
    const convertResponse = await fetch(`https://youtube-video-downloader-4k-and-8k-mp3.p.rapidapi.com/download.php?button=1&start=1&end=1&format=mp3&url=${videoLink}`, {
      "method": 'GET',
      "headers": {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': process.env.API_HOST
      }
    });

    const startData = await convertResponse.json();
    if (!startData.success) {
      return res.render("index", { 
        success: false, 
        message: "Failed to initialize download" 
      });
    }

    const downloadId = startData.id;
    
    const downloadVideoResponse = await fetch(`https://youtube-video-downloader-4k-and-8k-mp3.p.rapidapi.com/progress.php?id=${downloadId}`, {
      "method": 'GET',
      "headers": {
        'x-rapidapi-key': process.env.API_KEY,
        'x-rapidapi-host': process.env.API_HOST
      }
    });

    const downloadData = await downloadVideoResponse.json();

    return res.render("index", {
      success: true,
      song_title: startData.info.title,
      song_link: downloadData.download_url
    })

    
  } catch (error) {
    console.error('Conversion error:', error);
    return res.render("index", {
      success: false,
      message: "An error occurred during conversion"
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});