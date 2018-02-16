'use strict';
// Наложение фильтров на изображение.

(function () {
  var FULL_RESIZE = 1;
  var STEP_RESIZE = 0.25;
  var PREFIX_EFFECT = 'effect-';
  var FILTERS = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
  var SIZE_CONTROL = 455;
  var sizeWindow = document.documentElement.clientWidth;
  var startPin = (sizeWindow - SIZE_CONTROL) / 2;
  var resize = FULL_RESIZE;

  var effect = document.querySelectorAll('.upload-effect-preview');
  var imagePreview = document.querySelector('.effect-image-preview');
  var filterSlider = document.querySelector('.upload-effect-level');
  var pin = filterSlider.querySelector('.upload-effect-level-pin');
  var valueEffectLine = filterSlider.querySelector('.upload-effect-level-val');
  var valueEffectInput = filterSlider.querySelector('.upload-effect-level-value');
  var minus = document.querySelector('.upload-resize-controls-button-dec');
  var plus = document.querySelector('.upload-resize-controls-button-inc');
  var resizeControls = document.querySelector('.upload-resize-controls-value');

  filterSlider.hidden = 'hidden';

  var scaleEffect = function (scal) {
    var scale = scal / SIZE_CONTROL;

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

    valueEffectInput.value = Math.round(scale * 100);
    valueEffectLine.style.width = valueEffectInput.value + '%';
    pin.style.left = valueEffectInput.value + '%';

    return filter;
  };

  var applyFilter = function (filter) {
    var name = FILTERS[0];

    for (i = 0; i < FILTERS.length; i++) {
      var className = PREFIX_EFFECT + FILTERS[i];
      var classOn = imagePreview.classList.contains(className);

      if (classOn === true) {
        name = FILTERS[i];
      }
    }

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
    for (i = 0; i < FILTERS.length; i++) {
      var className = PREFIX_EFFECT + FILTERS[i];
      var classOn = imagePreview.classList.contains(className);

      if (classOn === true) {
        imagePreview.classList.remove(className);
      }
    }

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
    var shift = (evt.clientX - startPin);

    applyFilter(scaleEffect(shift));
  };

  filterSlider.addEventListener('mouseup', filterSliderMouseUpHandler);

  // Изменение размера изображения.

  imagePreview.style.transform = 'scale(' + FULL_RESIZE + ')';
  resizeControls.value = resize * 100 + '%';

  var resizeRise = function () {
    if (resize < FULL_RESIZE) {
      resize += STEP_RESIZE;
    }

    imagePreview.style.transform = 'scale(' + resize + ')';
    resizeControls.value = resize * 100 + '%';
  };

  var resizeDecline = function () {
    if (resize > STEP_RESIZE) {
      resize -= STEP_RESIZE;
    }

    imagePreview.style.transform = 'scale(' + resize + ')';
    resizeControls.value = resize * 100 + '%';
  };

  plus.addEventListener('click', function () {
    resizeRise();
  });

  minus.addEventListener('click', function () {
    resizeDecline();
  });
})();
