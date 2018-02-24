'use strict';
// Показ изображения в полном размере.

(function () {
  var pictureList = document.querySelector('.pictures');
  var galleryCover = document.querySelector('.gallery-overlay');
  var galleryClose = galleryCover.querySelector('.gallery-overlay-close');

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

    var valueSrc = evt.target.parentElement.querySelector('img').src;
    var valueComment = evt.target.parentElement.querySelector('.picture-comments').textContent;
    var valueLike = evt.target.parentElement.querySelector('.picture-likes').textContent;

    galleryOverlay(valueSrc, valueComment, valueLike);
  };

  pictureList.addEventListener('click', pictureClickHandler);

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
