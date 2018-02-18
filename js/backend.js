'use strict';

(function () {
  var URL = 'https://js.dump.academy/kekstagram';
  var URL_DATA = 'https://js.dump.academy/kekstagram/data';

  var direct = function (load, error, quest) {
    quest.responseType = 'json';

    quest.addEventListener('load', function () {
      if (quest.status === 200) {
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

    quest.timeout = 10000; // 10s
  };

  window.errorHandler = function (errorMessage) {
    var node = document.createElement('div');
    node.style = 'z-index: 100; margin: 0 auto; text-align: center; background-color: #a32417; color: #ece9aa';
    node.style.position = 'absolute';
    node.style.top = '35%';
    node.style.width = '400px';
    node.style.padding = '35px';
    node.style.left = 0;
    node.style.right = 0;
    node.style.fontSize = '30px';

    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      node.remove();
    }, 3000);
  };

  window.load = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();

    direct(onLoad, onError, xhr);
    xhr.open('GET', URL_DATA);
    xhr.send();
  };

  window.upload = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    direct(onLoad, onError, xhr);
    xhr.open('POST', URL);
    xhr.send(data);
  };
})();
