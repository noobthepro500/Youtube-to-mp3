import express from 'express';
import path from 'path';
import fetch from 'node-fetch';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.set('public', path.join(__dirname, 'public'));
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
        message: "Please enter a video link",
      });
    }

    console.log("API_KEY:", process.env.API_KEY);
    console.log("API_HOST:", process.env.API_HOST);
    console.log("Video Link:", videoLink);

    // Start the download
    const startResponse = await fetch(
      `https://${process.env.API_HOST}/download.php?button=1&start=1&end=1&format=mp3&url=${videoLink}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST,
        },
      }
    );

    const startData = await startResponse.json();
    console.log("Start Response:", startData);

    if (!startData.success) {
      return res.render("index", {
        success: false,
        message: "Failed to initialize download",
      });
    }

    const downloadId = startData.id;

    // Track the download progress
    const progressResponse = await fetch(
      `https://${process.env.API_HOST}/progress.php?id=${downloadId}`,
      {
        method: "GET",
        headers: {
          "x-rapidapi-key": process.env.API_KEY,
          "x-rapidapi-host": process.env.API_HOST,
        },
      }
    );

    const progressData = await progressResponse.json();
    console.log("Progress Response:", progressData);

    if (!progressData.success) {
      return res.render("index", {
        success: false,
        message: "Failed to track download progress",
      });
    }

    return res.render("index", {
      success: true,
      song_title: startData.info.title,
      song_link: progressData.download_url,
    });
  } catch (error) {
    console.error("Conversion error:", error);
    return res.render("index", {
      success: false,
      message: "An error occurred during conversion",
    });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});