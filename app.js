import express from "express";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.set("public", path.join(__dirname, "public"));
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get("/", (req, res) => {
	res.render("index");
});

// POST route
app.post("/convert-mp3", async (req, res) => {
	const videoLink = req.body.videoLink;

	if (videoLink === undefined || videoLink === "" || videoLink === null) {
		return res.render("index", {
			success: false,
			message: "Please enter a video ID",
		});
	} else {
		const fetchAPI = await fetch(
			`https://yt-search-and-download-mp3.p.rapidapi.com/mp3?url=${videoLink}`,
			{
				method: "GET",
				headers: {
					"x-rapidapi-key": process.env.API_KEY,
					"x-rapidapi-host": process.env.API_HOST,
				},
			}
		);

		const fetchResponse = await fetchAPI.json();

		console.log(fetchResponse);

		if (fetchResponse.success === true)
			return res.render("index", {
				success: true,
				song_title: fetchResponse.title,
				song_link: fetchResponse.download,
			});
		else
			return res.render("index", {
				success: false,
				message: fetchResponse.message,
			});
	}
});

// Start the server
app.listen(PORT, () => {
	console.log(`Server started on port ${PORT}`);
});
