'use strict';

window.addEventListener("load", function () {
  var menu = document.querySelector('.header__navigation');
  var menuToggle = document.querySelector('.menu-button');

  if (menuToggle) {
    menuToggle.addEventListener('click', function () {
      menuToggle.classList.toggle('menu-button--closed');
      menu.classList.toggle('header__navigation--close');
    });
  }
});
