function convertVideo(format) {
    const url = document.getElementById('youtube-url').value;
    if (!url) {
        alert('Please enter a YouTube URL');
        return;
    }
    fetch(`/convert?url=${encodeURIComponent(url)}&format=${format}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById('message').innerHTML = `
                    <a href="${data.file}" download>Download ${format.toUpperCase()}</a>
                `;
            } else {
                document.getElementById('message').textContent = data.error;
            }
        })
        .catch(error => {
            document.getElementById('message').textContent = 'An error occurred';
            console.error('Error:', error);
        });
}
