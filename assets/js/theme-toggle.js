document.addEventListener('DOMContentLoaded', function() {
  const themeToggle = document.querySelector('.theme-toggle');
  const htmlElement = document.documentElement;
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  // Apply saved theme on load
  if (savedTheme === 'dark') {
    document.body.classList.add('dark-theme');
    updateToggleIcon('light');
  } else {
    document.body.classList.remove('dark-theme');
    updateToggleIcon('dark');
  }
  
  // Toggle theme on button click
  themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('dark-theme');
    
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    updateToggleIcon(isDark ? 'light' : 'dark');
  });
  
  function updateToggleIcon(nextTheme) {
    if (nextTheme === 'dark') {
      themeToggle.innerHTML = '<i class="bi bi-moon-stars-fill"></i>';
      themeToggle.title = 'Switch to Dark Mode';
    } else {
      themeToggle.innerHTML = '<i class="bi bi-sun-fill"></i>';
      themeToggle.title = 'Switch to Light Mode';
    }
  }
});
