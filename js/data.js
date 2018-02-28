'use strict';
// Сортировка

(function () {
  var DEFAULT_SORT_TYPE = 'recommend';
  var sortType = DEFAULT_SORT_TYPE;
  var pictures = [];

  var filter = document.querySelector('.filters');
  var pictureList = document.querySelector('.pictures');

  var removeChildNodes = function (elem) {
    while (elem.lastChild) {
      elem.removeChild(elem.lastChild);
    }
  };

  var getRank = function (picture) {
    var rank = {
      popular: picture.likes,
      discussed: picture.comments.length,
      random: Math.random()
    };

    return rank[sortType];
  };

  var updatePictures = function () {
    var sorted = pictures.slice(0);

    removeChildNodes(pictureList);
    if (sortType === DEFAULT_SORT_TYPE) {
      return window.render(pictures);
    }
    sorted = sorted.sort(function (left, right) {
      return getRank(right) - getRank(left);
    });

    return window.render(sorted);
  };

  var onFilterClick = function (evt) {
    sortType = evt.target.value;
    window.debounce(updatePictures);
  };

  filter.addEventListener('click', onFilterClick);

  filter.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      evt.target.previousElementSibling.click();
    });
  });

  var onLoad = function (data) {
    pictures = data;
    window.render(pictures);
    filter.classList.remove('filters-inactive');
  };

  window.backend.load(onLoad, window.warning);
})();
