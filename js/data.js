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

  var render = function (data) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < PHOTO_NUMBER; i++) {
      fragment.appendChild(renderPicture(data[i]));
    }

    pictureList.appendChild(fragment);
  };

  // Сортировка

  var filter = document.querySelector('.filters');
  var recommend = document.querySelector('#filter-recommend');
  var populars = document.querySelector('#filter-popular');
  var discussed = document.querySelector('#filter-discussed');
  var random = document.querySelector('#filter-random');
  var pictures = [];
  var h = 0;

  var getRank = function (picture) {
    var url = picture.url;
    var index = url.length - 4;
    url = url.substring(7, index);
    var rank = {
      recommend: url * -1,
      popular: picture.likes,
      discussed: picture.comments.length,
      random: Math.random()
    };
    h = 'random';
    rank = rank[h];

    return rank;
  };

  var updatePictures = function () {
    pictures.sort(function (left, right) {
      var rankDiff = getRank(right) - getRank(left);
      return rankDiff;
    });
  };

  var loadHandler = function (data) {
    pictures = data;
    updatePictures();

    render(pictures);
    filter.classList.remove('filters-inactive');
  };

  window.load(loadHandler, window.errorHandler);

  // var recommendSelect = function {

  // }

  var popularSelect = function () {
    h = 'popular';
    updatePictures();
  };

  // var discussedSelect = function {

  // };

  // var randomSelect = function {

  // };

  populars.addEventListener('click', popularSelect);

})();
