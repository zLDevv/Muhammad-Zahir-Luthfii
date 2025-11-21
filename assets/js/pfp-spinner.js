document.addEventListener('DOMContentLoaded', function() {
  const pfpImage = document.querySelector('.pfp-image');
  const pfpContainer = document.querySelector('.pfp-container');
  
  if (pfpImage && pfpContainer) {
    // Start spinning on first hover and keep it spinning
    pfpContainer.addEventListener('mouseenter', function() {
      pfpImage.classList.add('spinning');
    });
  }
});
