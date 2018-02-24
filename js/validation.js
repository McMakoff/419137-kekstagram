'use strict';
// Валидация формы.

(function () {
  var NEW_HASHTAG = '#';
  var NORM_STROKE = 20;
  var NORM_HASHTAG = 5;
  var CHANCE_ERROR = 0;

  var inputHashtag = document.querySelector('.upload-form-hashtags');

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

  var controlTag = function (tag) {
    var originals = [];

    for (var i = 0; i < tag.length; i++) {
      var str = tag[i];

      controlUnique(originals, str);

      if (str[0] !== NEW_HASHTAG) {
        test.hach++;
      } if (str.length > NORM_STROKE) {
        test.long++;
      }
    }

    if (tag.length > NORM_HASHTAG) {
      test.amount++;
    } if (tag.length > originals.length) {
      test.unique++;
    }

    return test;
  };

  var inputHashtagСhangeHandler = function (evt) {
    controlTag(inputHashtag.value.toLowerCase().split(/\s{1,5}/));

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

  inputHashtag.addEventListener('change', inputHashtagСhangeHandler);
})();
