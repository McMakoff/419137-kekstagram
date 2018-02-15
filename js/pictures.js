'use strict';

var PHOTO_NUMBER = 25;
var MIN_PHOTO_NUMBER = 1;
var LIKES_NUMBER = 200;
var MIN_LIKES_NUMBER = 15;
var COMMENTS_NUMBER = 7;
var MIN_COMMENTS_NUMBER = 0;
var COMMENTS = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];

var galleryCover = document.querySelector('.gallery-overlay');
var pictureTemplate = document.querySelector('#picture-template').content;
var pictureList = document.querySelector('.pictures');

var generateRandom = function (topRange, bottomRange) {
  var chance = bottomRange + Math.random() * (topRange + 1 - bottomRange);
  chance = Math.floor(chance);

  return chance;
};

var designComment = function (range) {
  var photoComments = [];

  while (photoComments.length < range) {
    var start = Math.floor(Math.random() * COMMENTS.length);
    var end = Math.floor(Math.random() * COMMENTS.length);
    var fullComment = COMMENTS[start];

    if (fullComment !== COMMENTS[end]) {
      fullComment = COMMENTS[start] + ' ' + COMMENTS[end];
    }

    if (photoComments.indexOf(fullComment) === -1) {
      photoComments.push(fullComment);
    }
  }

  return photoComments;
};

var photos = [];

while (photos.length < PHOTO_NUMBER) {
  var randomNumber = generateRandom(PHOTO_NUMBER, MIN_PHOTO_NUMBER);

  if (photos.indexOf(randomNumber) === -1) {
    photos.push(randomNumber);
  }
}

var DesignPicture = function (url, like, comments) {
  this.url = 'photos/' + url + '.jpg';
  this.likes = like;
  this.comments = comments;
};

var pictures = [];

for (var i = 0; i < PHOTO_NUMBER; i++) {
  pictures[i] = new DesignPicture(photos[i].toString(), generateRandom(LIKES_NUMBER, MIN_LIKES_NUMBER), designComment(generateRandom(COMMENTS_NUMBER, MIN_COMMENTS_NUMBER)));
}

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture img').src = picture.url;
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < PHOTO_NUMBER; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}
pictureList.appendChild(fragment);

// Открытие и закрытие формы редактирования изображения.

var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var uploadOverlay = document.querySelector('.upload-overlay');
var uploadFile = document.querySelector('#upload-file');
var uploadCancel = document.querySelector('#upload-cancel');
var uploadDescription = document.querySelector('.upload-form-description');

var closePopup = function () {
  uploadOverlay.classList.add('hidden');
  uploadFile.value = '';
  document.removeEventListener('keydown', onPopupEscPress);
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

uploadFile.addEventListener('change', function () {
  openPopup();
});

uploadCancel.addEventListener('click', function () {
  closePopup();
});

uploadCancel.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closePopup();
  }
});

uploadDescription.addEventListener('keydown', function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    evt.stopPropagation();
  }
});

// Наложение эффекта на изображение.

var PREFIX_EFFECT = 'effect-';
var FILTERS = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
var SIZE_CONTROL = 455;
var sizeWindow = document.documentElement.clientWidth;
var startPin = (sizeWindow - SIZE_CONTROL) / 2;

var effect = document.querySelectorAll('.upload-effect-preview');
var imagePreview = document.querySelector('.effect-image-preview');
var filterSlider = document.querySelector('.upload-effect-level');
var pin = filterSlider.querySelector('.upload-effect-level-pin');
var valueEffectLine = filterSlider.querySelector('.upload-effect-level-val');
var valueEffectInput = filterSlider.querySelector('.upload-effect-level-value');

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

for (i = 0; i < effect.length; i++) {
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

var FULL_RESIZE = 1;
var STEP_RESIZE = 0.25;
var resize = FULL_RESIZE;

var minus = document.querySelector('.upload-resize-controls-button-dec');
var plus = document.querySelector('.upload-resize-controls-button-inc');
var resizeControls = document.querySelector('.upload-resize-controls-value');

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

// Показ изображения в полноэкранном режиме.

var picture = document.querySelectorAll('.picture');

var galleryOverlay = function (src, comment, like) {
  galleryCover.querySelector('.gallery-overlay-image').src = src;
  galleryCover.querySelector('.comments-count').textContent = comment;
  galleryCover.querySelector('.likes-count').textContent = like;

  galleryCover.classList.remove('hidden');
};

var pictureClickHandler = function (evt) {
  evt.preventDefault();

  var valueSrc = evt.target.src;
  var valueComment = evt.target.nextElementSibling.firstElementChild.textContent;
  var valueLike = evt.target.nextElementSibling.lastElementChild.textContent;

  galleryOverlay(valueSrc, valueComment, valueLike);
};

for (i = 0; i < picture.length; i++) {
  picture[i].addEventListener('click', pictureClickHandler);
}

// Валидация формы.

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

  for (i = 0; i < tag.length; i++) {
    var str = tag[i];

    controlUnique(originals, str);

    if (str.search(NEW_HASHTAG) !== 0) {
      test.hach = test.hach + 1;
    } if (str.length > NORM_STROKE) {
      test.long = test.long + 1;
    }
  }

  if (tag.length > NORM_HASHTAG) {
    test.amount = test.amount + 1;
  } if (tag.length > originals.length) {
    test.unique = test.unique + 1;
  }

  return test;
};

var inputBlurHandler = function (evt) {
  if (inputHashtag.value !== '') {
    var hashtags = inputHashtag.value.toLowerCase().split(/ /);
    controlTag(hashtags);
  }

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

inputHashtag.addEventListener('blur', inputBlurHandler);
