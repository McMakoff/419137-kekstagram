'use strict';
// Наложение фильтров на изображение.

(function () {
  var FULL_RESIZE = 1;
  var STEP_RESIZE = 0.25;
  var PREFIX_EFFECT = 'effect-';
  var FILTERS = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
  var SIZE_CONTROL = 455;
  var SIZE_PIN = 18;
  var sizeWindow = document.documentElement.clientWidth;
  var startPin = (sizeWindow - SIZE_CONTROL) / 2;
  var resize = FULL_RESIZE;

  var uploadFile = document.querySelector('#upload-file');
  var uploadOverlay = document.querySelector('.upload-overlay');
  var imagePreview = uploadOverlay.querySelector('.effect-image-preview');
  var effect = uploadOverlay.querySelectorAll('.upload-effect-preview');
  var noneEffect = uploadOverlay.querySelector('#upload-effect-none');
  var filterSlider = uploadOverlay.querySelector('.upload-effect-level');
  var pin = filterSlider.querySelector('.upload-effect-level-pin');
  var valueEffectLine = filterSlider.querySelector('.upload-effect-level-val');
  var valueEffectInput = filterSlider.querySelector('.upload-effect-level-value');
  var minus = uploadOverlay.querySelector('.upload-resize-controls-button-dec');
  var plus = uploadOverlay.querySelector('.upload-resize-controls-button-inc');
  var resizeControls = uploadOverlay.querySelector('.upload-resize-controls-value');
  var uploadClose = uploadOverlay.querySelector('#upload-cancel');
  var form = document.querySelector('#upload-select-image');
  var uploadDescription = uploadOverlay.querySelector('.upload-form-description');
  var uploadHashtags = uploadOverlay.querySelector('.upload-form-hashtags');

  var scaleEffect = function (extent) {
    var scale = (extent / SIZE_CONTROL).toFixed(2);

    var filter = {
      none: 'none',
      chrome: 'grayscale(' + scale + ')',
      sepia: 'sepia(' + scale + ')',
      marvin: 'invert(' + scale * 100 + '%)',
      phobos: 'blur(' + scale * 3 + 'px)',
      heat: 'brightness(' + scale * 3 + ')'
    };

    if (scale < 0) {
      scale = 0;
    } else if (scale > 1) {
      scale = 1;
    }

    valueEffectInput.value = scale * 100;
    valueEffectLine.style.width = valueEffectInput.value + '%';
    pin.style.left = valueEffectInput.value + '%';

    return filter;
  };

  var applyFilter = function (filter) {
    var index = imagePreview.classList.length - 1;
    var name = imagePreview.classList[index].split(PREFIX_EFFECT).pop();

    switch (name) {
      case FILTERS[1]:
        imagePreview.style.filter = filter.chrome;
        break;
      case FILTERS[2]:
        imagePreview.style.filter = filter.sepia;
        break;
      case FILTERS[3]:
        imagePreview.style.filter = filter.marvin;
        break;
      case FILTERS[4]:
        imagePreview.style.filter = filter.phobos;
        break;
      case FILTERS[5]:
        imagePreview.style.filter = filter.heat;
        break;
      default:
        imagePreview.style.filter = filter.none;
    }
  };

  var toggleFilter = function (name) {
    var index = imagePreview.classList.length - 1;
    imagePreview.classList.remove(imagePreview.classList[index]);

    if (name === FILTERS[0]) {
      filterSlider.hidden = 'hidden';
    } else {
      filterSlider.removeAttribute('hidden');
    }

    imagePreview.classList.add(PREFIX_EFFECT + name);
    applyFilter(scaleEffect(SIZE_CONTROL));
  };

  var effectClickHandler = function (evt) {
    var effectName = evt.target.parentElement.previousElementSibling.value;

    toggleFilter(effectName);
  };

  for (var i = 0; i < effect.length; i++) {
    effect[i].addEventListener('click', effectClickHandler);
  }

  // Управление ползунком.

  pin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = evt.clientX;

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = startCoords - moveEvt.clientX;
      startCoords = moveEvt.clientX;

      applyFilter(scaleEffect(pin.offsetLeft - shift));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  var filterSliderMouseUpHandler = function (evt) {
    var shift = evt.clientX - startPin + SIZE_PIN / 2;

    applyFilter(scaleEffect(shift));
  };

  filterSlider.addEventListener('mouseup', filterSliderMouseUpHandler);

  // Изменение размера изображения.

  var applyResize = function (extent) {
    imagePreview.style.transform = 'scale(' + extent + ')';
    resizeControls.value = (extent * 100) + '%';
  };

  var resizeRise = function () {
    if (resize < FULL_RESIZE) {
      resize += STEP_RESIZE;
    }

    applyResize(resize);
  };

  var resizeDecline = function () {
    if (resize > STEP_RESIZE) {
      resize -= STEP_RESIZE;
    }

    applyResize(resize);
  };

  plus.addEventListener('click', function () {
    resizeRise();
  });

  minus.addEventListener('click', function () {
    resizeDecline();
  });

  // Открытие и закрытие формы редактирования изображения.

  var prevent = function (element) {
    element.addEventListener('keydown', function (evt) {
      window.util.isEscEvent(evt, function () {
        evt.stopPropagation();
      });
    });
  };

  var reset = function () {
    uploadFile.value = '';
    resize = FULL_RESIZE;
    uploadDescription.value = '';
    uploadHashtags.value = '';
    noneEffect.checked = 'checked';
  };

  var resetDefault = function () {
    toggleFilter(FILTERS[0]);
    applyResize(FULL_RESIZE);
    prevent(uploadDescription);
    prevent(uploadHashtags);
  };

  var openPopup = function () {
    resetDefault();
    uploadOverlay.classList.remove('hidden');
    document.addEventListener('keydown', onPopupEscPress);
  };

  var closePopup = function () {
    reset();
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
    window.upload(new FormData(form), closePopup, window.errorHandler);
    evt.preventDefault();
  });
})();
