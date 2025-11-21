// Initialize persistent audio immediately
(function initAudio() {
  if (!window.persistentAudioPlayer) {
    const audio = new Audio('assets/audio/samurai-lofium-292016.mp3');
    audio.loop = true;
    audio.volume = 0.5;
    audio.id = 'global-persistent-audio';
    
    window.persistentAudioPlayer = audio;
    window.audioManager = {
      isPlaying: false,
      currentTime: 0,
      saveState: function() {
        localStorage.setItem('audioPlaying', this.isPlaying);
        localStorage.setItem('audioTime', audio.currentTime);
      },
      restoreState: function() {
        const wasPlaying = localStorage.getItem('audioPlaying') === 'true';
        const savedTime = parseFloat(localStorage.getItem('audioTime')) || 0;
        
        if (wasPlaying) {
          audio.currentTime = savedTime;
          try {
            audio.play();
            this.isPlaying = true;
          } catch(e) {
            console.log('Cannot auto-play:', e);
          }
        }
      }
    };
  }
})();

// Save audio state before navigation
window.addEventListener('beforeunload', function() {
  if (window.audioManager) {
    window.audioManager.saveState();
  }
});

document.addEventListener('DOMContentLoaded', function() {
  const audio = window.persistentAudioPlayer;
  const manager = window.audioManager;
  
  // Restore audio state on page load
  manager.restoreState();
  
  const pfpContainers = document.querySelectorAll('.pfp-container');
  
  pfpContainers.forEach(container => {
    const audioPlayer = container.querySelector('.audio-player');
    const audioElement = container.querySelector('audio');
    const pfpImage = container.querySelector('.pfp-image');
    
    if (audioPlayer && pfpImage) {
      // Make audio player visible
      audioPlayer.style.display = 'flex';
      
      // Hide local audio element but keep player div visible
      if (audioElement) {
        audioElement.style.display = 'none';
      }
      
      // Play audio on hover
      container.addEventListener('mouseenter', function() {
        audio.play().catch(err => {
          console.log('Play prevented:', err);
        });
        manager.isPlaying = true;
        pfpImage.classList.add('spinning');
      });
      
      // Only restore rotation if audio is already playing
      if (manager.isPlaying && !audio.paused) {
        pfpImage.classList.add('spinning');
      }
    }
  });
  
  // Sync rotation with audio state
  audio.addEventListener('play', function() {
    manager.isPlaying = true;
    document.querySelectorAll('.pfp-image').forEach(img => {
      img.classList.add('spinning');
    });
  });
  
  audio.addEventListener('pause', function() {
    manager.isPlaying = false;
    document.querySelectorAll('.pfp-image').forEach(img => {
      img.classList.remove('spinning');
    });
  });
  
  // Pause on tab switch
  document.addEventListener('visibilitychange', function() {
    if (document.hidden) {
      if (!audio.paused) {
        audio.pause();
      }
    } else if (manager.isPlaying) {
      audio.play().catch(err => {
        console.log('Resume prevented:', err);
      });
    }
  });
});

// Clean up completely when leaving site
window.addEventListener('unload', function() {
  localStorage.removeItem('audioPlaying');
  localStorage.removeItem('audioTime');
  if (window.persistentAudioPlayer) {
    window.persistentAudioPlayer.pause();
  }
});
