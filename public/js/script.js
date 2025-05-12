const hamburgerIcon = document.querySelector('.hamburger-icon');
const navLinks = document.querySelector('nav ul');

hamburgerIcon.addEventListener('click', () => {
  console.log('Hamburger clicked!'); // Add this line
  navLinks.classList.toggle('open');
});

