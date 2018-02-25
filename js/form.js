'use strict';

(function () {
  var FULL_RESIZE = 1;
  var STEP_RESIZE = 0.25;
  var PREFIX_EFFECT = 'effect-';
  var ORIGINAL_EFFECT = 'none';
  var CONTROL_SIZE = 455;
  var PIN_SIZE = 18;
  var startPin = (document.documentElement.clientWidth - CONTROL_SIZE) / 2;
  var resize = FULL_RESIZE;

  var form = document.querySelector('#upload-select-image');
  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var uploadClose = uploadOverlay.querySelector('#upload-cancel');
  var imagePreview = uploadOverlay.querySelector('.effect-image-preview');
  var effect = uploadOverlay.querySelector('.upload-effect');
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
    var name = imagePreview.className.split(/ /).pop();
    var scale = (extent / CONTROL_SIZE).toFixed(2);

    var filter = {
      'effect-none': 'none',
      'effect-chrome': 'grayscale(' + scale + ')',
      'effect-sepia': 'sepia(' + scale + ')',
      'effect-marvin': 'invert(' + scale * 100 + '%)',
      'effect-phobos': 'blur(' + scale * 3 + 'px)',
      'effect-heat': 'brightness(' + scale * 3 + ')'
    };

    if (scale < 0) {
      scale = 0;
    } else if (scale > 1) {
      scale = 1;
    }

    imagePreview.style.filter = filter[name];
    sliderInput.value = scale * 100;
    sliderLine.style.width = sliderInput.value + '%';
    pin.style.left = sliderInput.value + '%';
  };

  var effectToggle = function (name) {
    imagePreview.classList.remove(imagePreview.className.split(/ /).pop());

    if (name === ORIGINAL_EFFECT) {
      slider.hidden = 'hidden';
    } else {
      slider.removeAttribute('hidden');
    }

    imagePreview.classList.add(PREFIX_EFFECT + name);
    effectScale(CONTROL_SIZE);
  };

  var effectClickHandler = function (evt) {
    var effectName = evt.target.value;
    effectToggle(effectName);
  };

  effect.addEventListener('change', effectClickHandler);

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

  var sliderMouseUpHandler = function (evt) {
    var shift = evt.clientX - startPin + PIN_SIZE / 2;

    effectScale(shift);
  };

  slider.addEventListener('mouseup', sliderMouseUpHandler);

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
  };

  var defaultSetup = function () {
    effectToggle(ORIGINAL_EFFECT);
    applyResize(FULL_RESIZE);
    prevent(inputDescription);
    prevent(inputHashtag);
  };

  var resetSetup = function () {
    uploadFile.value = '';
    resize = FULL_RESIZE;
    inputDescription.value = '';
    inputHashtag.value = '';
    defaultEffect.checked = 'checked';
  };

  var openPopup = function () {
    defaultSetup();
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    resetSetup();
    uploadOverlay.classList.add('hidden');
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

  form.addEventListener('submit', function (evt) {
    window.backend.upload(new FormData(form), closePopup, window.backend.errorHandler);
    evt.preventDefault();
  });
})();
