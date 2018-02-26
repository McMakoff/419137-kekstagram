'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var LEFT_ARROW = 37;
  var RIGHT_ARROW = 39;

  window.util = {
    isEscEvent: function (evt, cb) {
      if (evt.keyCode === ESC_KEYCODE) {
        cb();
      }
    },
    isEnterEvent: function (evt, cb) {
      if (evt.keyCode === ENTER_KEYCODE) {
        cb();
      }
    },
    isLeftEvent: function (evt, cb) {
      if (evt.keyCode === LEFT_ARROW) {
        cb();
      }
    },
    isRightEvent: function (evt, cb) {
      if (evt.keyCode === RIGHT_ARROW) {
        cb();
      }
    }
  };
})();
