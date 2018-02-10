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

var uploadOverlay = document.querySelector('.upload-overlay');
var uploadFile = document.querySelector('#upload-file');
var uploadCancel = document.querySelector('#upload-cancel');

uploadFile.addEventListener('change', function () {
  uploadOverlay.classList.remove('hidden');
});

uploadCancel.addEventListener('click', function () {
  uploadOverlay.classList.add('hidden');
  uploadFile.setAttribute('value', '');
});

// Определение уровня насыщенности.

var SIZE_CONTROL = 455;
var SIZE_PIN = 9;
var sizeWindow = document.documentElement.clientWidth;
var startPin = (sizeWindow - SIZE_CONTROL) / 2;

var effectLevel = document.querySelector('.upload-effect-level');
var boxEffectPin = effectLevel.querySelector('.upload-effect-level-pin');
var lineEffectValue = effectLevel.querySelector('.upload-effect-level-val');
var inputEffectValue = effectLevel.querySelector('.upload-effect-level-value');

var inputValue = inputEffectValue.getAttribute('value');
lineEffectValue.style.width = inputValue + '%';

// хром, сепия           (valuePin / SIZE_CONTROL);
// марвин                (valuePin / SIZE_CONTROL) * 100;
// фобос, зной           (valuePin / SIZE_CONTROL) * 3;

boxEffectPin.addEventListener('mouseup', function () {
  var valuePin = event.clientX - startPin;
  inputEffectValue.setAttribute('value', Math.round((valuePin + SIZE_PIN) / SIZE_CONTROL * 100));
  lineEffectValue.style.width = (inputEffectValue.getAttribute('value')) + '%';
});

// Наложение эффекта на изображение.

var effect = document.querySelectorAll('.upload-effect-preview');
var imagePreview = document.querySelector('.effect-image-preview');
var effectSlider = document.querySelector('.upload-effect-level');

effectSlider.setAttribute('hidden', 'hidden');

var effectClickHandler = function () {
  var nameEffect = this.parentElement.previousElementSibling.getAttribute('value');

  if (nameEffect === 'none') {
    effectSlider.setAttribute('hidden', 'hidden');
  } else {
    effectSlider.removeAttribute('hidden');
  }

  imagePreview.classList.remove('effect-chrome', 'effect-sepia', 'effect-marvin', 'effect-phobos', 'effect-heat');
  imagePreview.classList.add('effect-' + nameEffect);
};

for (i = 0; i < effect.length; i++) {
  effect[i].addEventListener('click', effectClickHandler);
}

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
