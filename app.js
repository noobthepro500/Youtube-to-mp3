const express = require("express");
const fetch = require("node-fetch");
require("dotenv").config();
const path = require('path');

const app = express();

const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views')); 
app.use(express.static(path.join(__dirname, 'public'))); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
    res.render("index");
});

app.post("/convert-mp3", async (req, res) => {
    const videoId = req.body.videoId;

    if (videoId === undefined || videoId === "" || videoId === null) {
        return res.render("index", { success: false, message: "Please enter a video ID" });
    } else {
        const fetchAPI = await fetch(`https://youtube-mp36.p.rapidapi.com/dl?id=${videoId}`, {
            "method": "GET",
            "headers": {
                "x-rapidapi-key": process.env.API_KEY,
                "x-rapidapi-host": process.env.API_HOST
            }
        });

        const fetchResponse = await fetchAPI.json();

        if (fetchResponse.status === "ok") {
            return res.render("index", {
                success: true,
                song_title: fetchResponse.title,
                song_link: fetchResponse.link
            });
        } else {
            return res.render("index", { success: false, message: fetchResponse.msg });
        }
    }
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});