'use strict';
// Показ изображения в полноэкранном режиме.

(function () {
  var picture = document.querySelectorAll('.picture');
  var galleryCover = document.querySelector('.gallery-overlay');
  var galleryClose = galleryCover.querySelectorAll('.gallery-overlay-close');

  var openPopup = function () {
    galleryCover.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  var galleryOverlay = function (src, comment, like) {
    galleryCover.querySelector('.gallery-overlay-image').src = src;
    galleryCover.querySelector('.comments-count').textContent = comment;
    galleryCover.querySelector('.likes-count').textContent = like;

    openPopup();
  };

  var pictureClickHandler = function (evt) {
    evt.preventDefault();

    var valueSrc = evt.target.src;
    var valueComment = evt.target.nextElementSibling.firstElementChild.textContent;
    var valueLike = evt.target.nextElementSibling.lastElementChild.textContent;

    galleryOverlay(valueSrc, valueComment, valueLike);
  };

  for (var i = 0; i < picture.length; i++) {
    picture[i].addEventListener('click', pictureClickHandler);
  }

  var closePopup = function () {
    galleryCover.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  galleryClose.addEventListener('click', function () {
    closePopup();
  });

  galleryClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closePopup);
  });
})();
