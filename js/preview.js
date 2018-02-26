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

  var onPictureClick = function (evt) {
    evt.preventDefault();

    var pictureSrc = evt.target.parentElement.querySelector('img').src;
    var amountComment = evt.target.parentElement.querySelector('.picture-comments').textContent;
    var amountLike = evt.target.parentElement.querySelector('.picture-likes').textContent;

    galleryOverlay(pictureSrc, amountComment, amountLike);
  };

  pictureList.addEventListener('click', onPictureClick);

  pictureList.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      evt.preventDefault();
      evt.target.querySelector('img').click();
    });
  });

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
