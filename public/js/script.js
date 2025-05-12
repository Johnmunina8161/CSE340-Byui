document.addEventListener('DOMContentLoaded', () => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.navigation-links');

  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('open');
  });
});