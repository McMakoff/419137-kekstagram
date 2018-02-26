'use strict';

(function () {
  var FIRST_ELEMENT = 0;
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = document.querySelector('.upload-input');
  var preview = document.querySelector('.effect-image-preview');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[FIRST_ELEMENT];
    var fileName = file.name.toLowerCase();
    var reader = new FileReader();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (!matches) {
      return window.warning('Выберите файл в одном из форматов: ' + FILE_TYPES.join(', '));
    }

    reader.addEventListener('load', function () {
      preview.src = reader.result;
    });

    return reader.readAsDataURL(file);
  });
})();
