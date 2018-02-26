'use strict';

(function () {
  var FULL_RESIZE = 1;
  var STEP_RESIZE = 0.25;
  var PREFIX_EFFECT = 'effect-';
  var ORIGINAL_EFFECT = 'none';
  var CONTROL_SIZE = 455;
  var PIN_SIZE = 18;
  var startPin = (document.documentElement.clientWidth - CONTROL_SIZE + PIN_SIZE) / 2;
  var resize = FULL_RESIZE;
  var effect = ORIGINAL_EFFECT;

  var form = document.querySelector('#upload-select-image');
  var uploadFile = document.querySelector('#upload-file');
  var uploadControl = document.querySelector('.upload-control');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadClose = uploadOverlay.querySelector('#upload-cancel');
  var imagePreview = uploadOverlay.querySelector('.effect-image-preview');
  var selection = uploadOverlay.querySelector('.upload-effect-controls');
  var defaultEffect = uploadOverlay.querySelector('#upload-effect-none');
  var slider = uploadOverlay.querySelector('.upload-effect-level');
  var sliderInput = slider.querySelector('.upload-effect-level-value');
  var sliderLine = slider.querySelector('.upload-effect-level-val');
  var pin = slider.querySelector('.upload-effect-level-pin');
  var plus = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
  var minus = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
  var resizeValue = uploadOverlay.querySelector('.upload-resize-controls-value');
  var inputHashtag = uploadOverlay.querySelector('.upload-form-hashtags');
  var inputDescription = uploadOverlay.querySelector('.upload-form-description');

  // Применение эффектов к изображению.

  var effectScale = function (extent) {
    var scale = (extent / CONTROL_SIZE).toFixed(2);

    var filter = {
      'none': 'none',
      'chrome': 'grayscale(' + scale + ')',
      'sepia': 'sepia(' + scale + ')',
      'marvin': 'invert(' + scale * 100 + '%)',
      'phobos': 'blur(' + scale * 3 + 'px)',
      'heat': 'brightness(' + scale * 3 + ')'
    };

    if (scale < 0) {
      scale = 0;
    } else if (scale > 1) {
      scale = 1;
    }

    imagePreview.style.filter = filter[effect];
    sliderInput.value = scale * 100;
    sliderLine.style.width = sliderInput.value + '%';
    pin.style.left = sliderInput.value + '%';
  };

  var effectToggle = function () {
    imagePreview.classList.remove(imagePreview.className.split(/ /).pop());

    if (effect === ORIGINAL_EFFECT) {
      slider.hidden = 'hidden';
    } else {
      slider.removeAttribute('hidden');
    }

    imagePreview.classList.add(PREFIX_EFFECT + effect);
    effectScale(CONTROL_SIZE);
  };

  var onSelectionClick = function (evt) {
    effect = evt.target.value;
    effectToggle();
  };

  selection.addEventListener('change', onSelectionClick);

  var onSelectionEnterPress = function () {
    selection.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, function () {
        evt.target.previousElementSibling.click();
      });
    });
  };

  // Управление ползунком.

  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoords - moveEvt.clientX;
      startCoords = moveEvt.clientX;

      effectScale(pin.offsetLeft - shift);
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var onSliderMouseUp = function (evt) {
    var shift = evt.clientX - startPin + PIN_SIZE; // PIN_SIZE / 2 для FF

    effectScale(shift);
  };

  slider.addEventListener('mouseup', onSliderMouseUp);

  pin.addEventListener('keydown', function (evt) {
    window.util.isLeftEvent(evt, function () {
      effectScale(pin.offsetLeft - PIN_SIZE);
    });
    window.util.isRightEvent(evt, function () {
      effectScale(pin.offsetLeft + PIN_SIZE);
    });
  });

  // Изменение размера изображения.

  var applyResize = function (opposite) {
    resize += STEP_RESIZE * opposite;

    if (resize < STEP_RESIZE) {
      resize = STEP_RESIZE;
    } else if (resize > FULL_RESIZE) {
      resize = FULL_RESIZE;
    }

    imagePreview.style.transform = 'scale(' + resize + ')';
    resizeValue.value = (resize * 100) + '%';
  };

  plus.addEventListener('click', function () {
    applyResize(FULL_RESIZE);
  });

  minus.addEventListener('click', function () {
    applyResize(-FULL_RESIZE);
  });

  // Открытие и закрытие формы редактирования изображения.

  var prevent = function (element) {
    element.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, function () {
        evt.stopPropagation();
      });
    });
    element.addEventListener('keydown', function (evt) {
      window.util.isEnterEvent(evt, function () {
        evt.preventDefault();
      });
    });
  };

  var defaultSetup = function () {
    effectToggle();
    applyResize(FULL_RESIZE);
    prevent(inputDescription);
    prevent(inputHashtag);
  };

  var resetSetup = function () {
    uploadFile.value = '';
    resize = FULL_RESIZE;
    effect = ORIGINAL_EFFECT;
    defaultEffect.checked = 'checked';
    inputDescription.value = '';
    inputHashtag.value = '';
  };

  var openPopup = function () {
    defaultSetup();
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
    document.addEventListener('keydown', onSelectionEnterPress);
  };

  var closePopup = function () {
    resetSetup();
    uploadOverlay.classList.add('hidden');
    document.removeEventListener('keydown', onPopupEscPress);
    document.removeEventListener('keydown', onSelectionEnterPress);
  };

  var onPopupEscPress = function (evt) {
    window.util.isEscEvent(evt, closePopup);
  };

  uploadFile.addEventListener('change', function () {
    openPopup();
  });

  uploadControl.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      uploadFile.click();
    });
  });

  uploadClose.addEventListener('click', function () {
    closePopup();
  });

  uploadClose.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, closePopup);
  });

  form.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(form), closePopup, window.backend.onError);
    evt.preventDefault();
  });
})();
