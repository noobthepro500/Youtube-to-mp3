document.getElementById('form').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const progressBar = document.getElementById('progress-bar');
    progressBar.style.width = '0%';
    
    setTimeout(() => {
        progressBar.style.width = '100%';
    }, 100); 
  
    setTimeout(() => {
        this.submit();
    }, 600); 
});