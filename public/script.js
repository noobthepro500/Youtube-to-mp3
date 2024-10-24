function convertVideo(format) {
    const url = document.getElementById('youtube-url').value;
    const messageElement = document.getElementById('message');

    if (!url) {
        showMessage('Please enter a YouTube URL', 'error');
        return;
    }

    showMessage('Converting... Please wait.', 'info');

    fetch('/convert', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, format }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            showMessage(`
                Conversion successful! 
                <a href="${data.file}" download>Download ${format.toUpperCase()}</a>
            `, 'success');
        } else {
            showMessage(`Error: ${data.error}`, 'error');
        }
    })
    .catch(error => {
        showMessage(`An error occurred: ${error.message}`, 'error');
        console.error('Error:', error);
    });
}

function showMessage(message, type) {
    const messageElement = document.getElementById('message');
    messageElement.innerHTML = message;
    messageElement.className = type;
}
