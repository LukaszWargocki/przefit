const btn = document.getElementById('menu-btn');
const nav = document.getElementById('menu');

// add open class on click to button
btn.addEventListener('click', () => {
  btn.classList.toggle('open');
  nav.classList.toggle('flex');
  nav.classList.toggle('hidden');
})