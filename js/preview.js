'use strict';
// Отрисовка галереи изображений

(function () {
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
})();
