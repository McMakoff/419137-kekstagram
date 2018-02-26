'use strict';

(function () {
  var URL_FORM = 'https://js.dump.academy/kekstagram';
  var URL_DATA = 'https://js.dump.academy/kekstagram/data';
  var QUEST_STATUS_SUCCESS = 200;
  var QUEST_TIMEOUT = 10000;
  var REPORT_TIMEOUT = 3000;

  var direct = function (load, error, quest) {
    quest.responseType = 'json';

    quest.addEventListener('load', function () {
      if (quest.status === QUEST_STATUS_SUCCESS) {
        load(quest.response);
      } else {
        error('Статус ответа: ' + quest.status + ' ' + quest.statusText);
      }
    });

    quest.addEventListener('error', function () {
      error('Произошла ошибка соединения');
    });

    quest.addEventListener('timeout', function () {
      error('Запрос не успел выполниться за ' + quest.timeout + 'мс');
    });

    quest.timeout = QUEST_TIMEOUT;
  };

  window.backend = {
    onError: function (errorMessage) {
      var node = document.createElement('div');
      node.classList.add('error');
      node.textContent = errorMessage;
      document.body.insertAdjacentElement('afterbegin', node);

      setTimeout(function () {
        node.remove();
      }, REPORT_TIMEOUT);
    },
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();

      direct(onLoad, onError, xhr);
      xhr.open('GET', URL_DATA);
      xhr.send();
    },
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();

      direct(onLoad, onError, xhr);
      xhr.open('POST', URL_FORM);
      xhr.send(data);
    }
  };
})();
