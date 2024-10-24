document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const videoId = document.getElementById('videoId').value;
    
    if (!videoId) {
        alert('Please enter a video ID');
        return;
    }

    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';

    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100);

    setTimeout(() => {
        this.submit();
    }, 600); 
});