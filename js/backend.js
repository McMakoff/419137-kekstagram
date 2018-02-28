'use strict';

(function () {
  var URL_LOAD_DATA = 'https://js.dump.academy/kekstagram/data';
  var URL_UPLOAD_DATA = 'https://js.dump.academy/kekstagram';
  var HTTP_STATUS_SUCCESS = 200;
  var TIMEOUT = 10000;

  var setConfig = function (onLoad, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      if (xhr.status === HTTP_STATUS_SUCCESS) {
        return onLoad(xhr.response);
      }
      return onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = TIMEOUT;
    return xhr;
  };

  window.backend = {
    load: function (onLoad, onError) {
      var xhr = setConfig(onLoad, onError);

      xhr.open('GET', URL_LOAD_DATA);
      xhr.send();
    },
    upload: function (data, onLoad, onError) {
      var xhr = setConfig(onLoad, onError);

      xhr.open('POST', URL_UPLOAD_DATA);
      xhr.send(data);
    }
  };
})();
