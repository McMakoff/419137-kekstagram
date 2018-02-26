'use strict';
// Валидация формы.

(function () {
  var NEW_HASHTAG = '#';
  var NORM_STROKE = 20;
  var NORM_HASHTAG = 5;
  var CHANCE_ERROR = 0;

  var input = document.querySelector('.upload-form-hashtags');

  var test = {
    hach: CHANCE_ERROR,
    unique: CHANCE_ERROR,
    amount: CHANCE_ERROR,
    long: CHANCE_ERROR
  };

  var controlUnique = function (unique, stroke) {
    if (unique.indexOf(stroke) === -1) {
      unique.push(stroke);
    }

    return unique;
  };

  var controlTag = function (tags) {
    var originals = [];

    for (var i = 0; i < tags.length; i++) {
      var tag = tags[i];

      controlUnique(originals, tag);

      if (tag[0] !== NEW_HASHTAG) {
        test.hach++;
      } if (tag.length > NORM_STROKE) {
        test.long++;
      }
    }

    if (tags.length > NORM_HASHTAG) {
      test.amount++;
    } if (tags.length > originals.length) {
      test.unique++;
    }

    return test;
  };

  var onInputСhange = function (evt) {
    controlTag(input.value.toLowerCase().split(/\s{1,}/));

    if (test.hach !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Хэш-теги должны начинаться с "#".');
    } else if (test.long !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Длинна хэш-тега не более 20 символов.');
    } else if (test.amount !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Введите не более 5 хэш-тегов.');
    } else if (test.unique !== CHANCE_ERROR) {
      evt.target.setCustomValidity('Хэш-теги не должны повторяться.');
    } else {
      evt.target.setCustomValidity('');
    }

    test = {
      hach: CHANCE_ERROR,
      unique: CHANCE_ERROR,
      amount: CHANCE_ERROR,
      long: CHANCE_ERROR
    };
  };

  input.addEventListener('change', onInputСhange);
})();
