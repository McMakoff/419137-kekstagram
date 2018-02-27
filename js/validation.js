'use strict';
// Валидация формы.

(function () {
  var NEW_HASHTAG = '#';
  var POSITION_HASHTAG = 0;
  var SHORT_STROKE = 2;
  var NORM_STROKE = 20;
  var NORM_HASHTAG = 5;
  var test = true;

  var hashTagField = document.querySelector('.upload-form-hashtags');

  var checkTag = function (tags) {
    var originals = [];
    var message = '';

    tags.forEach(function (stroke) {
      if (originals.indexOf(stroke) === -1) {
        originals.push(stroke);
      }

      if (stroke[POSITION_HASHTAG] !== NEW_HASHTAG) {
        message = 'Хэш-теги должны начинаться с "' + NEW_HASHTAG + '".';
      } else if (stroke.length < SHORT_STROKE) {
        message = 'Введите слово.';
      } else if (stroke.length > NORM_STROKE) {
        message = 'Длинна хэш-тега не более ' + NORM_STROKE + ' символов.';
      }
    });

    if (tags.length > NORM_HASHTAG) {
      message = 'Введите не более ' + NORM_HASHTAG + ' хэш-тегов.';
    } else if (tags.length > originals.length) {
      message = 'Хэш-теги не должны повторяться.';
    }

    if (message !== '') {
      window.warning(message);
      test = false;
    }

    return test;
  };

  var onInputСhange = function (evt) {
    checkTag(hashTagField.value.toLowerCase().split(/\s{1,}/));

    if (test !== true) {
      evt.target.setCustomValidity('Неверный формат хэш-тегов');
    } else {
      evt.target.setCustomValidity('');
    }

    test = true;
  };

  hashTagField.addEventListener('change', onInputСhange);
})();
