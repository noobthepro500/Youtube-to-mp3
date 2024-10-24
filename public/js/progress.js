document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault(); // Prevent the default form submission

    const videoId = document.getElementById('videoId').value;
    
    if (!videoId) {
        alert('Please enter a video ID');
        return;
    }

    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';

    // Simulate progress
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100); // Start the animation after a short delay

    // Submit the form after the progress bar reaches 100%
    setTimeout(() => {
        this.submit();
    }, 600); // Adjust this timeout to match the transition duration
});