'use strict';

(function () {
  var ESC_KEYCODE = 27;
  var ENTER_KEYCODE = 13;
  var LEFT_ARROW = 37;
  var RIGHT_ARROW = 39;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    isEnterEvent: function (evt, action) {
      if (evt.keyCode === ENTER_KEYCODE) {
        action();
      }
    },
    isLeftEvent: function (evt, action) {
      if (evt.keyCode === LEFT_ARROW) {
        action();
      }
    },
    isRightEvent: function (evt, action) {
      if (evt.keyCode === RIGHT_ARROW) {
        action();
      }
    }
  };
})();
