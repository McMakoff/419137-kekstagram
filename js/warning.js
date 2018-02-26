'use strict';

(function () {
  var REPORT_TIMEOUT = 5000;

  window.warning = function (errorMessage) {
    var node = document.createElement('div');
    node.classList.add('error');
    node.textContent = errorMessage;
    document.body.insertAdjacentElement('afterbegin', node);

    setTimeout(function () {
      node.remove();
    }, REPORT_TIMEOUT);
  };
})();
