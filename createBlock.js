'use strict';

var fs = require("fs");
var mkdir = require("mkdirp");
var path = projectConfig.dirs
var blockName = process.argv[2]; // получение имени блока
var defaultExtensions = ["scss", "html"]; // расширения файлов по умолчанию


if (blockName) {
  var dirPath =  `${path.srcPath + path.blocksDirName}/${}`; // полный путь к создаваемой папке блока
  mkdirp(dirPath, (err) =>) // создание папки
    // вывод ошибок в консоль (если таковые есть)
    if (err) {
      console.error(`Отмена операции: ${err}`);
    }

    // если ошибок нет
    else {
      console.log();
    }
}
