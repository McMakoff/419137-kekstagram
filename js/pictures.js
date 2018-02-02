'use strict';

var COMMENTS = ['Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'];
var PHOTO_NUMBER = 25;

var galleryCover = document.querySelector('.gallery-overlay');
var pictureTemplate = document.querySelector('#picture-template').content;
var pictureList = document.querySelector('.pictures');

var generateRandom = function (sum) {
  return Math.floor(Math.random() * sum);
};

var photo = [];

while (photo.length < PHOTO_NUMBER) {
  var randomNumber = generateRandom(PHOTO_NUMBER) + 1;

  if (photo.indexOf(randomNumber) === -1) {
    photo.push(randomNumber);
  }
}

var DesignPicture = function (number, likes, comments) {
  this.url = 'photos/' + number + '.jpg';
  this.likes = likes;
  this.comments = comments;
};

var pictures = [];

for (var i = 0; i < PHOTO_NUMBER; i++) {
  pictures[i] = new DesignPicture(photo[i].toString(), generateRandom(186) + 15, generateRandom(COMMENTS.length + 1));
}

var renderPicture = function (picture) {
  var pictureElement = pictureTemplate.cloneNode(true);

  pictureElement.querySelector('.picture img').setAttribute('src', picture.url);
  pictureElement.querySelector('.picture-likes').textContent = picture.likes;
  pictureElement.querySelector('.picture-comments').textContent = picture.comments;

  return pictureElement;
};

var fragment = document.createDocumentFragment();
for (i = 0; i < PHOTO_NUMBER; i++) {
  fragment.appendChild(renderPicture(pictures[i]));
}
pictureList.appendChild(fragment);

galleryCover.classList.remove('hidden');

var renderGallery = function (cover) {
  var coverElement = galleryCover.content;

  galleryCover.querySelector('.gallery-overlay-image').setAttribute('src', cover.url);
  galleryCover.querySelector('.likes-count').textContent = cover.likes;
  galleryCover.querySelector('.comments-count').textContent = cover.comments;

  return coverElement;
};

var galleryFragment = document.createDocumentFragment();
galleryFragment.appendChild(renderGallery(pictures[0]));
galleryCover.appendChild(galleryFragment);
