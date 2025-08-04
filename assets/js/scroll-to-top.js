document.addEventListener('DOMContentLoaded', function() {
  const scrollBtn = document.getElementById('scrollToTopBtn');

  window.onscroll = function() {
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
      scrollBtn.style.display = 'block';
      scrollBtn.style.opacity = '1';
    } else {
      scrollBtn.style.display = 'none';
      scrollBtn.style.opacity = '0';
    }
  };

  scrollBtn.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
});
