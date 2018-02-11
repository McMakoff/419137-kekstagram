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

  pictureElement.querySelector('.picture img').setAttribute('src', picture.url);
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

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closePopup();
  }
};

var openPopup = function () {
  uploadOverlay.classList.remove('hidden');
  document.addEventListener('keydown', onPopupEscPress);
};

var closePopup = function () {
  uploadFile.setAttribute('value', '');
  uploadOverlay.classList.add('hidden');
  document.removeEventListener('keydown', onPopupEscPress);
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

// Наложение эффекта на изображение.

var DEPTH_EFFECT = 1;
var PREFIX_EFFECT = 'effect-';
var filters = ['none', 'chrome', 'sepia', 'marvin', 'phobos', 'heat'];
var SIZE_CONTROL = 455;
var SIZE_PIN = 9;
var sizeWindow = document.documentElement.clientWidth;
var startPin = (sizeWindow - SIZE_CONTROL) / 2;

var effect = document.querySelectorAll('.upload-effect-preview');
var imagePreview = document.querySelector('.effect-image-preview');
var effectSlider = document.querySelector('.upload-effect-level');
var effectLevel = document.querySelector('.upload-effect-level');
var pin = effectLevel.querySelector('.upload-effect-level-pin');
var valueEffectLine = effectLevel.querySelector('.upload-effect-level-val');
var valueEffectInput = effectLevel.querySelector('.upload-effect-level-value');

effectSlider.setAttribute('hidden', 'hidden');

var toggle = function (slider) {
  if (slider === filters[0]) {
    effectSlider.setAttribute('hidden', 'hidden');
  } else {
    effectSlider.removeAttribute('hidden');
  }
};

var purge = function (name) {
  for (i = 0; i < name.length; i++) {
    var className = PREFIX_EFFECT + filters[i];
    var classOn = imagePreview.classList.contains(className);

    if (classOn === true) {
      imagePreview.classList.remove(className);
    }
  }
};

var applyFilter = function (scale, name) {
  var none = 'none';
  var grayscale = 'grayscale(' + String(scale) + ')';
  var sepia = 'sepia(' + String(scale) + ')';
  var invert = 'invert(' + String(scale * 100) + '%)';
  var blur = 'blur(' + String(scale * 3) + 'px)';
  var brightness = 'brightness(' + String(scale * 3) + ')';

  if (name === filters[1]) {
    imagePreview.style.filter = grayscale;
  } else if (name === filters[2]) {
    imagePreview.style.filter = sepia;
  } else if (name === filters[3]) {
    imagePreview.style.filter = invert;
  } else if (name === filters[4]) {
    imagePreview.style.filter = blur;
  } else if (name === filters[5]) {
    imagePreview.style.filter = brightness;
  } else {
    imagePreview.style.filter = none;
  }

  valueEffectInput.setAttribute('value', Math.round(scale * 100));
  valueEffectLine.style.width = (valueEffectInput.getAttribute('value')) + '%';
  pin.style.left = (valueEffectInput.getAttribute('value')) + '%';
  imagePreview.classList.add(PREFIX_EFFECT + name);
};

var effectClickHandler = function () {
  var effectName = this.parentElement.previousElementSibling.getAttribute('value');

  purge(filters);
  toggle(effectName);
  applyFilter(DEPTH_EFFECT, effectName);
};

for (i = 0; i < effect.length; i++) {
  effect[i].addEventListener('click', effectClickHandler);
}

// Управление ползунком

var pinMouseUpHandler = function (evt) {
  var scaleFilter = (evt.clientX - startPin) / SIZE_CONTROL;

  for (i = 0; i < filters.length; i++) {
    var className = PREFIX_EFFECT + filters[i];
    var classOn = imagePreview.classList.contains(className);

    if (classOn === true) {
      applyFilter(scaleFilter, filters[i]);
    }
  }
};

pin.addEventListener('mouseup', pinMouseUpHandler);

// Показ изображения в полноэкранном режиме.

var picture = document.querySelectorAll('.picture');

var galleryOverlay = function (src, comment, like) {
  galleryCover.querySelector('.gallery-overlay-image').setAttribute('src', src);
  galleryCover.querySelector('.comments-count').textContent = comment;
  galleryCover.querySelector('.likes-count').textContent = like;

  galleryCover.classList.remove('hidden');
};

var pictureClickHandler = function (evt) {
  var valueSrc = this.querySelector('img').getAttribute('src');
  var valueComment = this.querySelector('.picture-comments').textContent;
  var valueLike = this.querySelector('.picture-likes').textContent;

  galleryOverlay(valueSrc, valueComment, valueLike);
  evt.preventDefault();
};

for (i = 0; i < picture.length; i++) {
  picture[i].addEventListener('click', pictureClickHandler);
}
