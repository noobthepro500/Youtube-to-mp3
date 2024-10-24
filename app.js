const express = require('express');
const ytdl = require('ytdl-core');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/convert', async (req, res) => {
    const { url, format } = req.body;
    
    if (!ytdl.validateURL(url)) {
        return res.status(400).json({ error: 'Invalid YouTube URL' });
    }

    try {
        const info = await ytdl.getInfo(url);
        const title = info.videoDetails.title.replace(/[^\w\s]/gi, '');
        const outputPath = path.join(__dirname, 'downloads', `${title}.${format}`);

        let options = {};
        if (format === 'mp3') {
            options = { filter: 'audioonly', quality: 'highestaudio' };
        } else if (format === 'mp4') {
            options = { filter: format => format.container === 'mp4', quality: 'highest' };
        } else {
            return res.status(400).json({ error: 'Invalid format' });
        }

        ytdl(url, options)
            .pipe(fs.createWriteStream(outputPath))
            .on('finish', () => {
                res.json({ success: true, file: `/downloads/${title}.${format}` });
            })
            .on('error', (err) => {
                console.error('Download error:', err);
                res.status(500).json({ error: 'Download failed' });
            });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Conversion failed' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
