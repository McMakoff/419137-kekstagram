'use strict';
// Отрисовка галереи изображений

(function () {
  var PHOTO_NUMBER = 26;

  var pictureTemplate = document.querySelector('#picture-template').content;
  var pictureList = document.querySelector('.pictures');

  var renderPicture = function (picture) {
    var pictureElement = pictureTemplate.cloneNode(true);

    pictureElement.querySelector('.picture img').src = picture.url;
    pictureElement.querySelector('.picture-likes').textContent = picture.likes;
    pictureElement.querySelector('.picture-comments').textContent = picture.comments.length;

    return pictureElement;
  };

  window.render = function (data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < PHOTO_NUMBER; i++) {
      fragment.appendChild(renderPicture(data[i]));
    }

    pictureList.appendChild(fragment);
  };
})();
