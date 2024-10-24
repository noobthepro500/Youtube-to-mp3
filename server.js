const express = require('express');
const bodyParser = require('body-parser');
const youtubedl = require('youtube-dl-exec');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Root route to serve index.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/convert', (req, res) => {
    const url = req.query.url;
    const format = req.query.format;

    if (!url || !format) {
        return res.json({ success: false, error: 'Invalid parameters' });
    }

    const outputPath = path.join(__dirname, 'downloads', `${Date.now()}.${format}`);

    youtubedl(url, {
        output: outputPath,
        format: format === 'mp3' ? 'bestaudio' : 'bestvideo+bestaudio'
    }).then(output => {
        if (format === 'mp3') {
            const mp3Path = outputPath.replace('mp4', 'mp3');
            ffmpeg(outputPath)
                .toFormat('mp3')
                .on('end', () => {
                    fs.unlinkSync(outputPath);
                    res.json({ success: true, file: mp3Path });
                })
                .save(mp3Path);
        } else {
            res.json({ success: true, file: outputPath });
        }
    }).catch(error => {
        console.error('Error downloading video:', error);
        res.json({ success: false, error: 'Failed to download video' });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
