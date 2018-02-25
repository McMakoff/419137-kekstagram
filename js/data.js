'use strict';
// Сортировка

(function () {
  var sorting = 'recommend';
  var pictures = [];

  var selection = document.querySelector('.filters');
  var pictureList = document.querySelector('.pictures');

  var removeChildren = function (elem) {
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

    rank = rank[sorting];

    return rank;
  };

  var updatePictures = function () {
    var sorted = pictures.slice(0);

    if (sorting === 'recommend') {
      window.render(pictures);
    } else {
      window.render(sorted.sort(function (left, right) {
        var rankDiff = getRank(right) - getRank(left);
        return rankDiff;
      }));
    }
  };

  var update = function () {
    removeChildren(pictureList);
    window.debounce(updatePictures);
  };

  var onSelectionClick = function (evt) {
    sorting = evt.target.value;
    update();
  };

  selection.addEventListener('click', onSelectionClick);

  selection.addEventListener('keydown', function (evt) {
    window.util.isEnterEvent(evt, function () {
      evt.target.previousElementSibling.checked = 'checked';
      sorting = evt.target.previousElementSibling.value;
      update();
    });
  });

  var onLoad = function (data) {
    pictures = data;
    window.render(pictures);
    selection.classList.remove('filters-inactive');
  };

  window.backend.load(onLoad, window.backend.onError);
})();
