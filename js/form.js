'use strict';
// Открытие и закрытие формы редактирования изображения.

(function () {
  var uploadFile = document.querySelector('#upload-file');
  var uploadClose = document.querySelector('#upload-cancel');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadDescription = document.querySelector('.upload-form-description');
  var uploadHashtags = document.querySelector('.upload-form-hashtags');

  var stopDefault = function (element) {
    element.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, function () {
        evt.stopPropagation();
      });
    });
  };

  var openPopup = function () {
    uploadOverlay.classList.remove('hidden');
    stopDefault(uploadDescription);
    stopDefault(uploadHashtags);
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    uploadOverlay.classList.add('hidden');
    uploadFile.value = '';
    document.removeEventListener('keydown', onPopupEscPress);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  uploadFile.addEventListener('change', function () {
    openPopup();
  });

  uploadClose.addEventListener('click', function () {
    closePopup();
  });

  uploadClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closePopup);
  });
})();
